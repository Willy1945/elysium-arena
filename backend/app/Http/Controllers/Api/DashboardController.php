<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Device;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();
        $monthStart = now()->startOfMonth()->toDateString();

        // ── Ringkasan Device ──
        $deviceCounts = Device::select('status', DB::raw('count(*) as total'))
            ->groupBy('status')
            ->pluck('total', 'status');

        $deviceSummary = [
            'total' => Device::count(),
            'available' => $deviceCounts['available'] ?? 0,
            'occupied' => $deviceCounts['occupied'] ?? 0,
            'booked' => $deviceCounts['booked'] ?? 0,
            'maintenance' => $deviceCounts['maintenance'] ?? 0,
        ];

        // ── Booking Hari Ini ──
        $bookingsToday = Booking::where('booking_date', $today)
            ->whereIn('status', ['pending', 'confirmed'])
            ->count();

        // ── Pendapatan Hari Ini ──
        $revenueToday = Transaction::where('status', 'paid')
            ->whereDate('created_at', $today)
            ->selectRaw('COALESCE(SUM(gaming_amount), 0) as gaming, COALESCE(SUM(food_amount), 0) as food')
            ->first();

        $transactionsToday = Transaction::where('status', 'paid')->whereDate('created_at', $today)->count();

        // ── Pendapatan Bulan Ini ──
        $revenueMonth = Transaction::where('status', 'paid')
            ->whereDate('created_at', '>=', $monthStart)
            ->sum('total_amount');

        // ── Grafik 7 Hari Terakhir (gaming vs food) ──
        $rawDaily = Transaction::where('status', 'paid')
            ->whereDate('created_at', '>=', now()->subDays(6)->toDateString())
            ->selectRaw('DATE(created_at) as date, SUM(gaming_amount) as gaming, SUM(food_amount) as food')
            ->groupBy('date')
            ->get()
            ->keyBy('date');

        $dailyChart = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $row = $rawDaily->get($date);
            $dailyChart[] = [
                'date' => Carbon::parse($date)->format('d M'),
                'gaming' => (int) ($row->gaming ?? 0),
                'food' => (int) ($row->food ?? 0),
            ];
        }

        return response()->json([
            'devices' => $deviceSummary,
            'bookings_today' => $bookingsToday,
            'revenue_today' => [
                'gaming' => (int) $revenueToday->gaming,
                'food' => (int) $revenueToday->food,
                'total' => (int) $revenueToday->gaming + (int) $revenueToday->food,
            ],
            'transactions_today' => $transactionsToday,
            'revenue_month' => (int) $revenueMonth,
            'daily_chart' => $dailyChart,
        ]);
    }
}