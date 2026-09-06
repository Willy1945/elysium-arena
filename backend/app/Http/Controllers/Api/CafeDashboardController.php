<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;

class CafeDashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        return response()->json([
            'pending_count' => Order::where('status', 'pending')->count(),
            'processing_count' => Order::where('status', 'processing')->count(),
            'ready_count' => Order::where('status', 'ready')->count(),
            'completed_today' => Order::where('status', 'completed')->whereDate('created_at', $today)->count(),
            'low_stock_products' => Product::whereColumn('stock', '<=', 'minimum_stock')
                ->where('is_active', true)
                ->orderBy('stock')
                ->limit(5)
                ->get(['id', 'name', 'stock', 'minimum_stock']),
        ]);
    }
}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           