<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Device;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingService
{
    /**
     * Cek apakah device tersedia pada rentang waktu tertentu.
     */
    public function isAvailable(int $deviceId, string $date, string $startTime, int $durationMinutes, ?int $excludeBookingId = null): bool
    {
        $start = Carbon::parse("$date $startTime");
        $end = $start->copy()->addMinutes($durationMinutes);

        $conflict = Booking::where('device_id', $deviceId)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->when($excludeBookingId, fn ($q) => $q->where('id', '!=', $excludeBookingId))
            ->where('start_time', '<', $end->format('H:i:s'))
            ->where('end_time', '>', $start->format('H:i:s'))
            ->exists();

        return ! $conflict;
    }

    /**
     * Ambil semua slot yang sudah terbooking pada tanggal tertentu (untuk ditampilkan di frontend).
     */
    public function getBookedSlots(int $deviceId, string $date): array
    {
        return Booking::where('device_id', $deviceId)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('start_time')
            ->get(['start_time', 'end_time'])
            ->map(fn ($b) => [
                'start_time' => substr($b->start_time, 0, 5),
                'end_time' => substr($b->end_time, 0, 5),
            ])
            ->toArray();
    }

    /**
     * Buat booking baru dengan validasi ulang (double-check) + row locking untuk mencegah race condition.
     */
    public function create(int $userId, array $data): Booking
    {
        return DB::transaction(function () use ($userId, $data) {
            $device = Device::where('id', $data['device_id'])->lockForUpdate()->first();

            if (! $device) {
                throw ValidationException::withMessages(['device_id' => 'Device tidak ditemukan.']);
            }

            if ($device->status === 'maintenance') {
                throw ValidationException::withMessages(['device_id' => 'Device sedang maintenance dan tidak bisa dibooking.']);
            }

            // Double-check availability di dalam transaction (mencegah race condition dua booking bentrok bersamaan)
            if (! $this->isAvailable($device->id, $data['booking_date'], $data['start_time'], $data['duration'])) {
                throw ValidationException::withMessages(['start_time' => 'Slot waktu ini sudah dibooking oleh customer lain.']);
            }

            $start = Carbon::parse($data['booking_date'] . ' ' . $data['start_time']);
            $end = $start->copy()->addMinutes($data['duration']);
            $totalPrice = ($data['duration'] / 60) * $device->price_per_hour;

            return Booking::create([
                'booking_code' => 'BK-' . now()->format('Ymd') . '-' . strtoupper(Str::random(5)),
                'user_id' => $userId,
                'device_id' => $device->id,
                'booking_date' => $data['booking_date'],
                'start_time' => $start->format('H:i:s'),
                'duration' => $data['duration'],
                'end_time' => $end->format('H:i:s'),
                'total_price' => $totalPrice,
                'status' => 'pending',
            ]);
        });
    }
}