<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Transaction\CheckoutOrdersRequest;
use App\Http\Requests\Transaction\PayTransactionRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\SessionResource;
use App\Http\Resources\TransactionResource;
use App\Models\GamingSession;
use App\Models\Order;
use App\Models\Transaction;
use App\Services\PaymentService;
use App\Services\TransactionService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class TransactionController extends Controller
{
    public function __construct(
        protected TransactionService $transactionService,
        protected PaymentService $paymentService
    ) {
    }

    public function index(Request $request)
    {
        $query = Transaction::with(['user', 'session.device', 'orders.items.product', 'payments']);

        $user = $request->user();
        if (!in_array($user->role?->name, ['OWNER', 'ADMIN'])) {
            $query->where('user_id', $user->id);
        }

        if ($request->boolean('archived')) {
            $query->whereNotNull('archived_at');
        } else {
            $query->visible(); // default: sembunyikan yang sudah diarsipkan
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return TransactionResource::collection($query->orderByDesc('created_at')->get());
    }

    public function show(Transaction $transaction)
    {
        return new TransactionResource($transaction->load(['user', 'session.device', 'orders.items.product', 'payments']));
    }

    /**
     * Daftar session & order yang siap di-checkout (belum ada transaksi).
     */
    public function checkoutable(Request $request)
    {
        $sessions = GamingSession::with(['user', 'device'])
            ->where('status', 'completed')
            ->doesntHave('transaction')
            ->orderByDesc('end_time')
            ->get();

        $orders = Order::with(['user', 'items.product'])
            ->whereNull('session_id')
            ->whereNull('transaction_id')
            ->whereIn('status', ['delivered', 'completed'])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'sessions' => SessionResource::collection($sessions),
            'orders' => OrderResource::collection($orders),
        ]);
    }

    public function checkoutSession(Request $request, GamingSession $session)
    {
        try {
            $transaction = $this->transactionService->checkoutSession($session->id);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal checkout.', 'errors' => $e->errors()], 422);
        }

        return new TransactionResource($transaction->load(['user', 'session.device', 'orders.items.product']));
    }

    public function checkoutOrders(CheckoutOrdersRequest $request)
    {
        try {
            $transaction = $this->transactionService->checkoutOrders($request->order_ids, $request->user_id);
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal checkout.', 'errors' => $e->errors()], 422);
        }

        return new TransactionResource($transaction->load(['user', 'orders.items.product']));
    }

    public function pay(PayTransactionRequest $request, Transaction $transaction)
    {
        try {
            $transaction = $this->paymentService->pay($transaction, $request->validated('method'));
        } catch (ValidationException $e) {
            return response()->json(['message' => $e->getMessage() ?: 'Gagal memproses pembayaran.', 'errors' => $e->errors()], 422);
        }

        return new TransactionResource($transaction->load(['user', 'session.device', 'orders.items.product', 'payments']));
    }

    public function archive(Transaction $transaction)
    {
        if ($transaction->status !== 'paid') {
            return response()->json([
                'message' => 'Hanya transaksi dengan status Lunas yang bisa diarsipkan.',
            ], 422);
        }

        $transaction->update(['archived_at' => now()]);

        return response()->json(['message' => 'Transaksi berhasil diarsipkan.']);
    }

    public function unarchive(Transaction $transaction)
    {
        $transaction->update(['archived_at' => null]);

        return response()->json(['message' => 'Transaksi berhasil dikembalikan dari arsip.']);
    }
}