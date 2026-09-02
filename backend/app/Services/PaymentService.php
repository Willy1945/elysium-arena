<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Transaction;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PaymentService
{
    public function pay(Transaction $transaction, string $method): Transaction
    {
        return DB::transaction(function () use ($transaction, $method) {
            $transaction = Transaction::where('id', $transaction->id)->lockForUpdate()->first();

            if ($transaction->status === 'paid') {
                throw ValidationException::withMessages(['status' => 'Transaksi ini sudah dibayar.']);
            }

            if ($transaction->status === 'cancelled') {
                throw ValidationException::withMessages(['status' => 'Transaksi ini sudah dibatalkan.']);
            }

            Payment::create([
                'transaction_id' => $transaction->id,
                'method' => $method,
                'amount' => $transaction->total_amount,
                'status' => 'paid',
                'paid_at' => now(),
            ]);

            $transaction->update(['status' => 'paid']);

            return $transaction->fresh();
        });
    }
}