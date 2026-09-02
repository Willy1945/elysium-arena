<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Device;
use App\Models\GamingSession;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class SessionService
{
    public function start(array $data): GamingSession
    {
        return DB::transaction(function () use ($data) {
            $device = Device::where('id', $data['device_id'])->lockForUpdate()->first();

            if ($device->status === 'maintenance') {
                throw ValidationException::withMessages(['device_id' => 'Device sedang maintenance.']);
            }

            if ($device->sessions()->where('status', 'active')->exists()) {
                throw ValidationException::withMessages(['device_id' => 'Device ini sudah memiliki session yang sedang berjalan.']);
            }

            $userId = $data['user_id'] ?? null;
            $bookingId = $data['booking_id'] ?? null;

            if ($bookingId) {
                $booking = Booking::where('id', $bookingId)->lockForUpdate()->first();

                if (! $booking || $booking->device_id !== $device->id) {
                    throw ValidationException::withMessages(['booking_id' => 'Booking tidak valid untuk device ini.']);
                }

                if (! in_array($booking->status, ['pending', 'confirmed'])) {
                    throw ValidationException::withMessages(['booking_id' => 'Booking ini tidak bisa dimulai (status: ' . $booking->status . ').']);
                }

                $userId = $booking->user_id;
                $booking->update(['status' => 'confirmed']);
            }

            $startTime = now();
            $endTime = $startTime->copy()->addMinutes($data['duration']);
            $price = ($data['duration'] / 60) * $device->price_per_hour;

            $session = GamingSession::create([
                'booking_id' => $bookingId,
                'user_id' => $userId,
                'device_id' => $device->id,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'duration' => $data['duration'],
                'price' => $price,
                'status' => 'active',
            ]);

            $device->update(['status' => 'occupied']);

            return $session;
        });
    }

    public function extend(GamingSession $session, int $additionalMinutes): GamingSession
    {
        return DB::transaction(function () use ($session, $additionalMinutes) {
            $session = GamingSession::where('id', $session->id)->lockForUpdate()->first();

            if ($session->status !== 'active') {
                throw ValidationException::withMessages(['status' => 'Session ini sudah tidak aktif.']);
            }

            $device = $session->device;
            $newDuration = $session->duration + $additionalMinutes;

            $session->update([
                'end_time' => Carbon::parse($session->end_time)->addMinutes($additionalMinutes),
                'duration' => $newDuration,
                'price' => ($newDuration / 60) * $device->price_per_hour,
            ]);

            return $session->fresh();
        });
    }

    public function end(GamingSession $session): GamingSession
    {
        return DB::transaction(function () use ($session) {
            $session = GamingSession::where('id', $session->id)->lockForUpdate()->first();

            if ($session->status !== 'active') {
                throw ValidationException::withMessages(['status' => 'Session ini sudah tidak aktif.']);
            }

            $session->update(['status' => 'completed']);

            $device = Device::where('id', $session->device_id)->lockForUpdate()->first();
            if ($device->status !== 'maintenance') {
                $device->update(['status' => 'available']);
            }

            if ($session->booking_id) {
                $session->booking()->update(['status' => 'completed']);
            }

            return $session->fresh();
        });
    }
}