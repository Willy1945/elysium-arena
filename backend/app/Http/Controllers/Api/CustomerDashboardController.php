<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\SessionResource;
use App\Http\Resources\TransactionResource;
use App\Models\Booking;
use App\Models\GamingSession;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;

class CustomerDashboardController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $activeSession = GamingSession::with(['device.deviceType'])
            ->where('user_id', $userId)
            ->where('status', 'active')
            ->first();

        $upcomingBookings = Booking::with(['device.deviceType'])
            ->where('user_id', $userId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('booking_date', '>=', now()->toDateString())
            ->orderBy('booking_date')
            ->orderBy('start_time')
            ->limit(5)
            ->get();

        $activeOrders = Order::with(['items.product'])
            ->where('user_id', $userId)
            ->whereNotIn('status', ['completed', 'cancelled'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $pendingTransactions = Transaction::with(['session.device', 'orders'])
            ->where('user_id', $userId)
            ->where('status', 'pending')
            ->orderByDesc('created_at')
            ->get();

        $recentTransactions = Transaction::with(['session.device'])
            ->where('user_id', $userId)
            ->where('status', 'paid')
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        return response()->json([
            'active_session' => $activeSession ? new SessionResource($activeSession) : null,
            'upcoming_bookings' => BookingResource::collection($upcomingBookings),
            'active_orders' => OrderResource::collection($activeOrders),
            'pending_transactions' => TransactionResource::collection($pendingTransactions),
            'recent_transactions' => TransactionResource::collection($recentTransactions),
        ]);
    }
}