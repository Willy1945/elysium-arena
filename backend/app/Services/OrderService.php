<?php

namespace App\Services;

use App\Models\InventoryLog;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function create(array $data, int $actorId): Order
    {
        return DB::transaction(function () use ($data, $actorId) {
            $totalPrice = 0;
            $lockedProducts = [];

            // Lock & validasi stok semua item dulu, sebelum ada yang diproses (all-or-nothing)
            foreach ($data['items'] as $item) {
                $product = Product::where('id', $item['product_id'])->lockForUpdate()->first();

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

            $order = Order::create([
                'order_code' => 'ORD-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'user_id' => $data['user_id'],
                'session_id' => $data['session_id'] ?? null,
                'status' => 'pending',
                'total_price' => $totalPrice,
            ]);

            foreach ($data['items'] as $item) {
                $product = $lockedProducts[$item['product_id']];
                $subtotal = $product->price * $item['quantity'];

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ]);

                $product->decrement('stock', $item['quantity']);

                InventoryLog::create([
                    'product_id' => $product->id,
                    'user_id' => $actorId,
                    'quantity' => $item['quantity'],
                    'type' => 'out',
                    'reason' => 'Order ' . $order->order_code,
                ]);
            }

            return $order;
        });
    }

    public function updateStatus(Order $order, string $status, int $actorId): Order
    {
        return DB::transaction(function () use ($order, $status, $actorId) {
            $order = Order::where('id', $order->id)->lockForUpdate()->first();

            if ($status === 'cancelled' && $order->status !== 'cancelled') {
                // Kembalikan stok kalau order dibatalkan
                foreach ($order->items as $item) {
                    $product = Product::where('id', $item->product_id)->lockForUpdate()->first();
                    $product->increment('stock', $item->quantity);

                    InventoryLog::create([
                        'product_id' => $product->id,
                        'user_id' => $actorId,
                        'quantity' => $item->quantity,
                        'type' => 'in',
                        'reason' => 'Pembatalan Order ' . $order->order_code,
                    ]);
                }
            }

            $order->update(['status' => $status]);

            return $order->fresh();
        });
    }
}