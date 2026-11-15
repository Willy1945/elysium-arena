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
    public function __construct(protected TelegramService $telegramService)
    {
    }

    public function isAvailable(int $deviceId, string $date, string $startTime, int $durationMinutes, ?int $excludeBookingId = null): bool
    {
        $tz = config('app.timezone', 'Asia/Jakarta');
        $start = Carbon::parse("$date $startTime", $tz);
        $end = $start->copy()->addMinutes($durationMinutes);

        // Cannot book slot that has already started/passed
        if ($start->copy()->addMinute()->isPast()) {
            return false;
        }

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

        if ($date === now($tz)->toDateString()) {
            $activeSession = GamingSession::where('device_id', $deviceId)
                ->where('status', 'active')
                ->first();

            if ($activeSession) {
                $sessionStart = Carbon::parse($activeSession->start_time, $tz);
                $sessionEnd = Carbon::parse($activeSession->end_time, $tz);
                if ($sessionEnd->gt($start) && $sessionStart->lt($end)) {
                    return false;
                }
            }
        }

        return true;
    }

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

        $tz = config('app.timezone', 'Asia/Jakarta');
        if ($date === now($tz)->toDateString()) {
            $activeSession = GamingSession::where('device_id', $deviceId)
                ->where('status', 'active')
                ->first();

            if ($activeSession) {
                $slots[] = [
                    'start_time' => Carbon::parse($activeSession->start_time, $tz)->format('H:i'),
                    'end_time' => Carbon::parse($activeSession->end_time, $tz)->format('H:i'),
                ];
            }
        }

        return $slots;
    }

    public function create(int $userId, array $data): Booking
    {
        $booking = DB::transaction(function () use ($userId, $data) {
            $device = Device::where('id', $data['device_id'])->lockForUpdate()->first();

            if (! $device) {
                throw ValidationException::withMessages(['device_id' => 'Device tidak ditemukan.']);
            }

            if ($device->status === 'maintenance') {
                throw ValidationException::withMessages(['device_id' => 'Device sedang maintenance dan tidak bisa dibooking.']);
            }

            if (! $this->isAvailable($device->id, $data['booking_date'], $data['start_time'], $data['duration'])) {
                throw ValidationException::withMessages(['start_time' => 'Slot waktu ini sudah tidak tersedia atau sudah lewat.']);
            }

            $start = Carbon::parse($data['booking_date'] . ' ' . $data['start_time']);
            $end = $start->copy()->addMinutes($data['duration']);
            $totalPrice = ($data['duration'] / 60) * $device->price_per_hour;

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

        $this->telegramService->sendNewBookingNotification($booking);

        return $booking;
    }
}