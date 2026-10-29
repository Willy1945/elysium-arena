<?php

namespace App\Services;

use App\Models\LoyaltyReward;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(protected TelegramService $telegramService)
    {
    }

    public function create(array $data, int $actorId): Order
    {
        $order = DB::transaction(function () use ($data, $actorId) {
            $totalPrice = 0;
            $lockedProducts = [];

            foreach ($data['items'] as $item) {
                $product = Product::with('category')->where('id', $item['product_id'])->lockForUpdate()->first();

                if (! $product->is_active) {
                    throw ValidationException::withMessages(['items' => "Produk {$product->name} sedang tidak tersedia."]);
                }

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => "Stok {$product->name} tidak mencukupi. Sisa stok: {$product->stock}",
                    ]);
                }

                $lockedProducts[$item['product_id']] = $product;
                $totalPrice += $product->price * $item['quantity'];
            }

            $reward = null;
            $discount = 0;
            $discountedProductId = null;

            if (! empty($data['reward_id'])) {
                $reward = LoyaltyReward::with('catalog')
                    ->where('id', $data['reward_id'])
                    ->where('user_id', $actorId)
                    ->where('status', 'available')
                    ->where('type', 'free_food')
                    ->first();

                if (! $reward) {
                    throw ValidationException::withMessages([
                        'reward_id' => 'Reward tidak valid atau sudah terpakai.',
                    ]);
                }

                $rewardTitle = strtolower($reward->title ?? $reward->catalog?->title ?? '');
                $isDrinkReward = str_contains($rewardTitle, 'minum') || str_contains($rewardTitle, 'kopi');
                $isNoodleReward = str_contains($rewardTitle, 'mie');

                $eligibleItem = null;
                foreach ($data['items'] as $item) {
                    $prod = $lockedProducts[$item['product_id']];
                    $catName = strtolower($prod->category?->name ?? '');
                    $prodName = strtolower($prod->name);

                    if ($isDrinkReward) {
                        if ($catName === 'minuman' || $catName === 'kopi' || str_contains($prodName, 'kopi') || str_contains($prodName, 'teh') || str_contains($prodName, 'minerale')) {
                            $eligibleItem = $item;
                            break;
                        }
                    } elseif ($isNoodleReward) {
                        if (str_contains($prodName, 'mie')) {
                            $eligibleItem = $item;
                            break;
                        }
                    }
                }

                if (! $eligibleItem) {
                    if ($isDrinkReward) {
                        throw ValidationException::withMessages([
                            'reward_id' => 'Voucher ini berlaku untuk menu Minuman/Kopi. Silakan tambahkan minuman ke keranjang.',
                        ]);
                    } elseif ($isNoodleReward) {
                        throw ValidationException::withMessages([
                            'reward_id' => 'Voucher ini berlaku untuk menu Mie. Silakan tambahkan menu mie ke keranjang.',
                        ]);
                    } else {
                        $eligibleItem = $data['items'][0];
                    }
                }

                $discountProduct = $lockedProducts[$eligibleItem['product_id']];
                $discount = $discountProduct->price;
                $discountedProductId = $discountProduct->id;
                $totalPrice = max(0, $totalPrice - $discount);
            }

            $order = Order::create([
                'order_code' => 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'user_id' => $data['user_id'],
                'session_id' => $data['session_id'] ?? null,
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            $rewardItemHandled = false;
            foreach ($data['items'] as $item) {
                $product = $lockedProducts[$item['product_id']];
                $quantity = $item['quantity'];

                if ($discountedProductId && $item['product_id'] === $discountedProductId && ! $rewardItemHandled) {
                    $rewardItemHandled = true;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => 1,
                        'price' => 0,
                        'subtotal' => 0,
                    ]);

                    if ($quantity > 1) {
                        $remainingQty = $quantity - 1;
                        $remainingSubtotal = $product->price * $remainingQty;
                        OrderItem::create([
                            'order_id' => $order->id,
                            'product_id' => $product->id,
                            'quantity' => $remainingQty,
                            'price' => $product->price,
                            'subtotal' => $remainingSubtotal,
                        ]);
                    }
                } else {
                    $subtotal = $product->price * $quantity;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $quantity,
                        'price' => $product->price,
                        'subtotal' => $subtotal,
                    ]);
                }

                $product->decrement('stock', $quantity);
            }

            if ($reward) {
                $reward->update([
                    'status' => 'redeemed',
                    'redeemed_order_id' => $order->id,
                    'redeemed_at' => now(),
                ]);
            }

            return $order;
        });

        $this->telegramService->sendNewOrderNotification($order);

        return $order;
    }

    public function updateStatus(Order $order, string $status, int $actorId): Order
    {
        return DB::transaction(function () use ($order, $status, $actorId) {
            $order = Order::where('id', $order->id)->lockForUpdate()->first();

            if ($status === 'cancelled' && $order->status !== 'cancelled') {

                foreach ($order->items as $item) {
                    $product = Product::where('id', $item->product_id)->lockForUpdate()->first();
                    if ($product) {
                        $product->increment('stock', $item->quantity);
                    }
                }

                LoyaltyReward::where('redeemed_order_id', $order->id)
                    ->update([
                        'status' => 'available',
                        'redeemed_order_id' => null,
                        'redeemed_at' => null,
                    ]);
            }

            $order->update(['status' => $status]);

            return $order->fresh();
        });
    }
}