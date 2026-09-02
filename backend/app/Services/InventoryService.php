<?php

namespace App\Services;

use App\Models\InventoryLog;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventoryService
{
    public function adjustStock(Product $product, string $type, int $quantity, string $reason, int $userId): Product
    {
        return DB::transaction(function () use ($product, $type, $quantity, $reason, $userId) {
            $product = Product::where('id', $product->id)->lockForUpdate()->first();

            if ($type === 'out' && $product->stock < $quantity) {
                throw ValidationException::withMessages(['quantity' => 'Stok tidak mencukupi. Sisa stok: ' . $product->stock]);
            }

            $newStock = $type === 'in' ? $product->stock + $quantity : $product->stock - $quantity;
            $product->update(['stock' => $newStock]);

            InventoryLog::create([
                'product_id' => $product->id,
                'user_id' => $userId,
                'quantity' => $quantity,
                'type' => $type,
                'reason' => $reason,
            ]);

            return $product->fresh();
        });
    }
}