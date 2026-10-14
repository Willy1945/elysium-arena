<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Device;
use App\Models\GamingSession;
use App\Models\LoyaltyReward;
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

        // 1. Cek bentrok dengan booking lain
        $conflict = Booking::where('device_id', $deviceId)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->when($excludeBookingId, fn ($q) => $q->where('id', '!=', $excludeBookingId))
            ->where('start_time', '<', $end->format('H:i:s'))
            ->where('end_time', '>', $start->format('H:i:s'))
            ->exists();

        if ($conflict) {
            return false;
        }

        // 2. Cek bentrok dengan active session yang sedang berlangsung hari ini
        if ($date === now()->toDateString()) {
            $activeSession = GamingSession::where('device_id', $deviceId)
                ->where('status', 'active')
                ->first();

            if ($activeSession) {
                $sessionStart = Carbon::parse($activeSession->start_time);
                $sessionEnd = Carbon::parse($activeSession->end_time);
                if ($sessionEnd->gt($start) && $sessionStart->lt($end)) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Ambil semua slot yang sudah terbooking pada tanggal tertentu (untuk ditampilkan di frontend).
     */
    public function getBookedSlots(int $deviceId, string $date): array
    {
        $slots = Booking::where('device_id', $deviceId)
            ->where('booking_date', $date)
            ->whereIn('status', ['pending', 'confirmed'])
            ->orderBy('start_time')
            ->get(['start_time', 'end_time'])
            ->map(fn ($b) => [
                'start_time' => substr($b->start_time, 0, 5),
                'end_time' => substr($b->end_time, 0, 5),
            ])
            ->toArray();

        // Jika mengecek ketersediaan hari ini, tambahkan sesi bermain yang sedang aktif sebagai slot terisi
        if ($date === now()->toDateString()) {
            $activeSession = GamingSession::where('device_id', $deviceId)
                ->where('status', 'active')
                ->first();

            if ($activeSession) {
                $slots[] = [
                    'start_time' => Carbon::parse($activeSession->start_time)->format('H:i'),
                    'end_time' => Carbon::parse($activeSession->end_time)->format('H:i'),
                ];
            }
        }

        return $slots;
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

            // ── Reward: Gratis Jam Main (1 Jam atau 2 Jam) ──
            $reward = null;
            if (! empty($data['reward_id'])) {
                $reward = LoyaltyReward::where('id', $data['reward_id'])
                    ->where('user_id', $userId)
                    ->where('status', 'available')
                    ->whereIn('type', ['free_hour', 'free_2_hours'])
                    ->first();

                if (! $reward) {
                    throw ValidationException::withMessages([
                        'reward_id' => 'Reward tidak valid atau sudah terpakai.',
                    ]);
                }

                $freeHours = ($reward->type === 'free_2_hours') ? 2 : 1;
                $discount = min($device->price_per_hour * $freeHours, $totalPrice);
                $totalPrice -= $discount;
            }

            $booking = Booking::create([
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

            if ($reward) {
                $reward->update([
                    'status' => 'redeemed',
                    'redeemed_booking_id' => $booking->id,
                    'redeemed_at' => now(),
                ]);
            }

            return $booking;
        });
    }
}