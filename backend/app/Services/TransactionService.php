<?php

namespace App\Services;

use App\Models\GamingSession;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TransactionService
{
    /**
     * Checkout dari session yang sudah selesai — otomatis menggabungkan
     * biaya gaming + semua order F&B yang terhubung ke session itu.
     */
    public function checkoutSession(int $sessionId): Transaction
    {
        return DB::transaction(function () use ($sessionId) {
            $session = GamingSession::where('id', $sessionId)->lockForUpdate()->first();

            if (! $session) {
                throw ValidationException::withMessages(['session_id' => 'Session tidak ditemukan.']);
            }

            if ($session->status !== 'completed') {
                throw ValidationException::withMessages(['session_id' => 'Session harus diakhiri terlebih dahulu sebelum checkout.']);
            }

            if ($session->transaction()->exists()) {
                throw ValidationException::withMessages(['session_id' => 'Session ini sudah memiliki transaksi.']);
            }

            $orders = Order::where('session_id', $session->id)
                ->whereNull('transaction_id')
                ->where('status', '!=', 'cancelled')
                ->lockForUpdate()
                ->get();

            $gamingAmount = $session->price;
            $foodAmount = $orders->sum('total_price');

            $transaction = Transaction::create([
                'transaction_code' => 'TRX-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'user_id' => $session->user_id,
                'session_id' => $session->id,
                'gaming_amount' => $gamingAmount,
                'food_amount' => $foodAmount,
                'total_amount' => $gamingAmount + $foodAmount,
                'status' => 'pending',
            ]);

            Order::whereIn('id', $orders->pluck('id'))->update(['transaction_id' => $transaction->id]);

            return $transaction;
        });
    }

    /**
     * Checkout order take-away (tanpa session gaming) — misal customer cuma beli makanan.
     */
    public function checkoutOrders(array $orderIds, int $userId): Transaction
    {
        return DB::transaction(function () use ($orderIds, $userId) {
            $orders = Order::whereIn('id', $orderIds)
                ->whereNull('session_id')
                ->whereNull('transaction_id')
                ->where('user_id', $userId)
                ->where('status', '!=', 'cancelled')
                ->lockForUpdate()
                ->get();

            if ($orders->isEmpty()) {
                throw ValidationException::withMessages(['order_ids' => 'Tidak ada order valid untuk di-checkout.']);
            }

            $foodAmount = $orders->sum('total_price');

            $transaction = Transaction::create([
                'transaction_code' => 'TRX-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'user_id' => $userId,
                'session_id' => null,
                'gaming_amount' => 0,
                'food_amount' => $foodAmount,
                'total_amount' => $foodAmount,
                'status' => 'pending',
            ]);

            Order::whereIn('id', $orders->pluck('id'))->update(['transaction_id' => $transaction->id]);

            return $transaction;
        });
    }
}