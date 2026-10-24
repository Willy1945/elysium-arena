<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\Device;
use App\Models\GamingSession;
use App\Models\LoyaltyTransaction;
use App\Models\Notification;
use App\Models\User;
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
            $guestName = $data['guest_name'] ?? null;
            $bookingId = $data['booking_id'] ?? null;

            if ($bookingId) {
                $booking = Booking::where('id', $bookingId)->lockForUpdate()->first();

                if (!$booking || $booking->device_id !== $device->id) {
                    throw ValidationException::withMessages(['booking_id' => 'Booking tidak valid untuk device ini.']);
                }

                if (!in_array($booking->status, ['pending', 'confirmed'])) {
                    throw ValidationException::withMessages(['booking_id' => 'Booking ini tidak bisa dimulai (status: ' . $booking->status . ').']);
                }

                $userId = $booking->user_id;
                $guestName = null;
                $booking->update(['status' => 'confirmed']);
            } elseif ($userId) {
                // Auto-detect: Sambungkan ke jadwal booking pelanggan jika menyewa stasiun yang sama hari ini
                $matchedBooking = Booking::where('device_id', $device->id)
                    ->where('user_id', $userId)
                    ->where('booking_date', now()->toDateString())
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->first();

                if ($matchedBooking) {
                    $bookingId = $matchedBooking->id;
                    $matchedBooking->update(['status' => 'confirmed']);
                }
            }

            if (! $userId && empty($guestName)) {
                $guestName = 'Tamu Walk-In';
            }

            $startTime = now();
            $endTime = $startTime->copy()->addMinutes($data['duration']);

            // ── VALIDASI BUFFER JADWAL: CEK BENTROK DENGAN BOOKING MENDATANG ──
            $targetDates = array_unique([$startTime->toDateString(), $endTime->toDateString()]);
            $upcomingBookings = Booking::where('device_id', $device->id)
                ->whereIn('status', ['pending', 'confirmed'])
                ->when($bookingId, fn ($q) => $q->where('id', '!=', $bookingId))
                ->whereIn('booking_date', $targetDates)
                ->orderBy('booking_date')
                ->orderBy('start_time')
                ->get();

            foreach ($upcomingBookings as $b) {
                $bDateStr = Carbon::parse($b->booking_date)->format('Y-m-d');
                $bStart = Carbon::parse($bDateStr . ' ' . $b->start_time);
                $bEnd = Carbon::parse($bDateStr . ' ' . $b->end_time);
                if ($bEnd->lte($bStart)) {
                    $bEnd->addDay();
                }

                // Cek apakah rentang waktu sesi menabrak rentang waktu booking
                if ($bStart->lt($endTime) && $bEnd->gt($startTime)) {
                    $availableMinutes = (int) max(0, $startTime->diffInMinutes($bStart, false));
                    $bookingTimeFormatted = substr($b->start_time, 0, 5);
                    if ($availableMinutes < 15) {
                        throw ValidationException::withMessages([
                            'duration' => "Jadwal bentrok: Device ini sudah memiliki booking pada pukul {$bookingTimeFormatted}. Waktu yang tersisa tidak mencukupi untuk memulai sesi baru.",
                        ]);
                    } else {
                        throw ValidationException::withMessages([
                            'duration' => "Jadwal bentrok: Device ini sudah memiliki booking pada pukul {$bookingTimeFormatted}. Durasi maksimal yang tersedia adalah {$availableMinutes} menit.",
                        ]);
                    }
                }
            }

            $price = ($data['duration'] / 60) * $device->price_per_hour;

            $session = GamingSession::create([
                'booking_id' => $bookingId,
                'user_id' => $userId,
                'guest_name' => $guestName,
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

            // Pengaman: Waktu baru tidak boleh mundur melebihi waktu sekarang
            $newEndTime = Carbon::parse($session->end_time)->addMinutes($additionalMinutes);
            if ($newEndTime->lte(now())) {
                throw ValidationException::withMessages(['additional_minutes' => 'Tidak dapat mengurangi waktu melebihi durasi bermain yang sudah terpakai.']);
            }

            if ($newDuration < 15) {
                throw ValidationException::withMessages(['additional_minutes' => 'Total durasi sesi minimal adalah 15 menit.']);
            }

            // ── VALIDASI BUFFER JADWAL: CEK BENTROK SAAT PERPANJANGAN (EXTEND) ──
            if ($additionalMinutes > 0) {
                $sessionCurrentEnd = Carbon::parse($session->end_time);
                $targetDates = array_unique([$sessionCurrentEnd->toDateString(), $newEndTime->toDateString()]);

                $upcomingBookings = Booking::where('device_id', $device->id)
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->when($session->booking_id, fn ($q) => $q->where('id', '!=', $session->booking_id))
                    ->whereIn('booking_date', $targetDates)
                    ->orderBy('booking_date')
                    ->orderBy('start_time')
                    ->get();

                foreach ($upcomingBookings as $b) {
                    $bDateStr = Carbon::parse($b->booking_date)->format('Y-m-d');
                    $bStart = Carbon::parse($bDateStr . ' ' . $b->start_time);
                    $bEnd = Carbon::parse($bDateStr . ' ' . $b->end_time);
                    if ($bEnd->lte($bStart)) {
                        $bEnd->addDay();
                    }

                    // Cek apakah perpanjangan menabrak booking ini
                    if ($bStart->lt($newEndTime) && $bEnd->gt($sessionCurrentEnd)) {
                        $maxAddMinutes = (int) max(0, $sessionCurrentEnd->diffInMinutes($bStart, false));
                        $bookingTimeFormatted = substr($b->start_time, 0, 5);
                        if ($maxAddMinutes <= 0) {
                            throw ValidationException::withMessages([
                                'additional_minutes' => "Tidak dapat memperpanjang sesi: Device ini sudah memiliki booking berikutnya pada pukul {$bookingTimeFormatted}.",
                            ]);
                        } else {
                            throw ValidationException::withMessages([
                                'additional_minutes' => "Tidak dapat memperpanjang {$additionalMinutes} menit: Device ini sudah memiliki booking pada pukul {$bookingTimeFormatted}. Perpanjangan maksimal yang diizinkan adalah {$maxAddMinutes} menit.",
                            ]);
                        }
                    }
                }
            }

            $session->update([
                'end_time' => $newEndTime,
                'duration' => $newDuration,
                'price' => max(0, ($newDuration / 60) * $device->price_per_hour),
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
            } elseif ($session->user_id) {
                Booking::where('device_id', $session->device_id)
                    ->where('user_id', $session->user_id)
                    ->where('booking_date', Carbon::parse($session->start_time)->toDateString())
                    ->whereIn('status', ['pending', 'confirmed'])
                    ->update(['status' => 'completed']);
            }

            if ($session->user_id) {
                $this->awardLoyaltyPoints($session, $device);
            }

            return $session->fresh();
        });
    }

    private function awardLoyaltyPoints(GamingSession $session, ?Device $device): void
    {
        // 1 jam (60 menit) = 100 poin
        // 2 jam (120 menit) = 200 poin
        $durationMinutes = (int) $session->duration;
        $points = (int) round(($durationMinutes / 60) * 100);

        if ($points <= 0) {
            return;
        }

        $user = User::where('id', $session->user_id)->lockForUpdate()->first();
        if (! $user) {
            return;
        }

        $user->increment('loyalty_points', $points);

        $hoursFormatted = round($durationMinutes / 60, 1);
        $deviceName = $device ? $device->name : 'Station Gaming';

        LoyaltyTransaction::create([
            'user_id' => $user->id,
            'type' => 'earn_session',
            'amount' => $points,
            'description' => "Selesai Sesi Bermain {$deviceName} ({$hoursFormatted} Jam)",
            'reference_id' => $session->id,
        ]);

        Notification::create([
            'user_id' => $user->id,
            'title' => 'Koin Loyalitas Bertambah!',
            'message' => "Selamat! Kamu mendapatkan {$points} koin dari sesi bermain {$deviceName} ({$hoursFormatted} Jam).",
            'type' => 'loyalty_reward',
        ]);
    }
}