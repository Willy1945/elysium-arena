<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BookingResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\SessionResource;
use App\Http\Resources\TransactionResource;
use App\Models\Booking;
use App\Models\GamingSession;
use App\Models\DeviceRating;
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

        $activeBookingIds = GamingSession::where('user_id', $userId)
            ->where('status', 'active')
            ->whereNotNull('booking_id')
            ->pluck('booking_id')
            ->toArray();

        if ($activeSession) {
            $todayDeviceBookingIds = Booking::where('user_id', $userId)
                ->where('device_id', $activeSession->device_id)
                ->where('booking_date', now()->toDateString())
                ->whereIn('status', ['pending', 'confirmed'])
                ->pluck('id')
                ->toArray();
            $activeBookingIds = array_unique(array_merge($activeBookingIds, $todayDeviceBookingIds));
        }

        $upcomingBookings = Booking::with(['device.deviceType'])
            ->where('user_id', $userId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->whereNotIn('id', $activeBookingIds)
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
            ->whereNull('customer_hidden_at')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $bookingHistory = Booking::with(['device.deviceType'])
            ->where('user_id', $userId)
            ->whereIn('status', ['completed', 'cancelled'])
            ->orderByDesc('booking_date')
            ->orderByDesc('start_time')
            ->limit(10)
            ->get();

        $hasCompletedSession = GamingSession::where('user_id', $userId)->where('status', 'completed')->exists();
        $myRating = DeviceRating::where('user_id', $userId)->first();

        return response()->json([
            'loyalty_points' => (int) ($request->user()->loyalty_points ?? 0),
            'available_rewards_count' => $request->user()->loyaltyRewards()->where('status', 'available')->count(),
            'active_session' => $activeSession ? new SessionResource($activeSession) : null,
            'upcoming_bookings' => BookingResource::collection($upcomingBookings),
            'booking_history' => BookingResource::collection($bookingHistory),
            'active_orders' => OrderResource::collection($activeOrders),
            'pending_transactions' => TransactionResource::collection($pendingTransactions),
            'recent_transactions' => TransactionResource::collection($recentTransactions),
            'can_rate_arena' => $hasCompletedSession && !$myRating,
            'my_rating' => $myRating ? [
                'id' => $myRating->id,
                'rating' => (int) $myRating->rating,
                'comment' => $myRating->comment,
                'created_at' => $myRating->created_at?->toISOString(),
            ] : null,
        ]);
    }
}