<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Booking\StoreBookingRequest;
use App\Http\Resources\BookingResource;
use App\Models\Booking;
use App\Models\Device;
use App\Services\BookingService;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function __construct(protected BookingService $bookingService)
    {
    }

    public function index(Request $request)
    {
        $query = Booking::with(['user', 'device.deviceType']);

        $user = $request->user();
        if (!in_array($user->role?->name, ['OWNER', 'ADMIN'])) {
            $query->where('user_id', $user->id);
        }

        if ($request->filled('device_id')) {
            $query->where('device_id', $request->device_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('date')) {
            $query->where('booking_date', $request->date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('booking_code', 'like', "%{$search}%")
                    ->orWhereHas('user', fn($u) => $u->where('name', 'like', "%{$search}%"));
            });
        }

        return BookingResource::collection($query->orderByDesc('booking_date')->orderByDesc('start_time')->get());
    }

    public function show(Request $request, Booking $booking)
    {
        $user = $request->user();
        if (!in_array($user->role?->name, ['OWNER', 'ADMIN']) && $booking->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak memiliki akses ke booking ini.'], 403);
        }

        return new BookingResource($booking->load(['user', 'device.deviceType']));
    }

    public function availability(Request $request, Device $device)
    {
        $request->validate(['date' => ['required', 'date']]);

        return response()->json([
            'device_id' => $device->id,
            'date' => $request->date,
            'booked_slots' => $this->bookingService->getBookedSlots($device->id, $request->date),
        ]);
    }

    public function store(StoreBookingRequest $request)
    {
        try {
            $booking = $this->bookingService->create($request->user()->id, $request->validated());
        } catch (ValidationException $e) {
            return response()->json([
                'message' => $e->getMessage() ?: 'Booking gagal dibuat.',
                'errors' => $e->errors(),
            ], 422);
        }

        return new BookingResource($booking->load(['user', 'device.deviceType']));
    }

    public function updateStatus(Request $request, Booking $booking)
    {
        $request->validate([
            'status' => ['required', 'in:confirmed,cancelled,completed'],
        ]);

        $user = $request->user();
        $isStaff = in_array($user->role?->name, ['OWNER', 'ADMIN']);

        if (!$isStaff) {
            if ($booking->user_id !== $user->id || $request->status !== 'cancelled' || $booking->status === 'completed') {
                return response()->json(['message' => 'Anda tidak memiliki akses untuk mengubah status ini.'], 403);
            }

            $hasActiveSession = \App\Models\GamingSession::where('status', 'active')
                ->where(function ($q) use ($booking) {
                    $q->where('booking_id', $booking->id)
                      ->orWhere(function ($sub) use ($booking) {
                          $sub->where('device_id', $booking->device_id)
                              ->where('user_id', $booking->user_id);
                      });
                })
                ->exists();

            if ($hasActiveSession) {
                return response()->json([
                    'message' => 'Jadwal booking tidak dapat dibatalkan karena sesi bermain di stasiun ini sedang berjalan aktif.',
                ], 422);
            }
        }

        $booking->update(['status' => $request->status]);

        return new BookingResource($booking->load(['user', 'device.deviceType']));
    }

    public function destroy(Request $request, Booking $booking)
    {
        $user = $request->user();
        $isStaff = in_array($user->role?->name, ['OWNER', 'ADMIN']);

        if (!$isStaff && $booking->user_id !== $user->id) {
            return response()->json(['message' => 'Anda tidak berhak menghapus booking ini.'], 403);
        }

        if (!in_array($booking->status, ['completed', 'cancelled'])) {
            return response()->json([
                'message' => 'Hanya booking dengan status Selesai atau Dibatalkan yang bisa dihapus dari riwayat.',
            ], 422);
        }

        $booking->delete();

        return response()->json(['message' => 'Booking berhasil dihapus.']);
    }

    public function clearHistory(Request $request)
    {
        $user = $request->user();

        Booking::where('user_id', $user->id)
            ->whereIn('status', ['completed', 'cancelled'])
            ->delete();

        return response()->json(['message' => 'Semua riwayat booking yang selesai atau dibatalkan berhasil dibersihkan.']);
    }
}