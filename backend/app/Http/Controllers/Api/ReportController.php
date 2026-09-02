<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    protected function resolveDateRange(Request $request): array
    {
        $period = $request->get('period', 'month');
        $today = now();

        return match ($period) {
            'today' => [$today->copy()->startOfDay(), $today->copy()->endOfDay()],
            'week' => [$today->copy()->startOfWeek(), $today->copy()->endOfWeek()],
            'month' => [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()],
            'custom' => [
                $request->filled('from') ? \Carbon\Carbon::parse($request->from)->startOfDay() : $today->copy()->startOfMonth(),
                $request->filled('to') ? \Carbon\Carbon::parse($request->to)->endOfDay() : $today->copy()->endOfDay(),
            ],
            default => [$today->copy()->startOfMonth(), $today->copy()->endOfMonth()],
        };
    }

    public function revenue(Request $request)
    {
        [$from, $to] = $this->resolveDateRange($request);

        $transactions = Transaction::with(['user', 'session.device'])
            ->where('status', 'paid')
            ->whereBetween('created_at', [$from, $to])
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'summary' => [
                'total_transactions' => $transactions->count(),
                'gaming_total' => $transactions->sum('gaming_amount'),
                'food_total' => $transactions->sum('food_amount'),
                'grand_total' => $transactions->sum('total_amount'),
            ],
            'transactions' => $transactions->map(fn ($t) => [
                'transaction_code' => $t->transaction_code,
                'customer' => $t->user?->name,
                'gaming_amount' => $t->gaming_amount,
                'food_amount' => $t->food_amount,
                'total_amount' => $t->total_amount,
                'date' => $t->created_at->format('Y-m-d H:i'),
            ]),
        ]);
    }

    public function gaming(Request $request)
    {
        [$from, $to] = $this->resolveDateRange($request);

        $perDevice = Transaction::whereNotNull('session_id')
            ->where('status', 'paid')
            ->whereBetween('created_at', [$from, $to])
            ->with('session.device')
            ->get()
            ->groupBy(fn ($t) => $t->session?->device?->code ?? 'Unknown')
            ->map(fn ($group, $code) => [
                'device_code' => $code,
                'total_sessions' => $group->count(),
                'total_revenue' => $group->sum('gaming_amount'),
            ])
            ->values();

        return response()->json([
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'per_device' => $perDevice,
            'total_revenue' => $perDevice->sum('total_revenue'),
        ]);
    }

    public function food(Request $request)
    {
        [$from, $to] = $this->resolveDateRange($request);

        $topProducts = OrderItem::whereHas('order', function ($q) use ($from, $to) {
            $q->where('status', '!=', 'cancelled')->whereBetween('created_at', [$from, $to]);
        })
            ->with('product')
            ->get()
            ->groupBy(fn ($item) => $item->product?->name ?? 'Unknown')
            ->map(fn ($group, $name) => [
                'product_name' => $name,
                'total_qty' => $group->sum('quantity'),
                'total_revenue' => $group->sum('subtotal'),
            ])
            ->sortByDesc('total_revenue')
            ->values();

        return response()->json([
            'from' => $from->toDateString(),
            'to' => $to->toDateString(),
            'top_products' => $topProducts,
            'total_revenue' => $topProducts->sum('total_revenue'),
        ]);
    }

    public function inventory()
    {
        $products = Product::with('category')
            ->whereColumn('stock', '<=', 'minimum_stock')
            ->orderBy('stock')
            ->get();

        return response()->json([
            'low_stock_products' => $products->map(fn ($p) => [
                'name' => $p->name,
                'category' => $p->category?->name,
                'stock' => $p->stock,
                'minimum_stock' => $p->minimum_stock,
                'status' => $p->stock_status,
            ]),
        ]);
    }
}