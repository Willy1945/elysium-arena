<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamingSession extends Model
{
    use HasFactory;

    // Nama class beda dari nama tabel, jadi wajib dideklarasikan manual
    protected $table = 'sessions';

    protected $fillable = [
        'booking_id',
        'user_id',
        'device_id',
        'start_time',
        'end_time',
        'duration',
        'price',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
        ];
    }

    // ── Relationships ──
    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'session_id');
    }

    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'session_id');
    }

    // ── Helper untuk timer (§6 PRD): sisa detik dihitung dari end_time, bukan setInterval polos ──
    public function getRemainingSecondsAttribute(): int
    {
        return max(0, now()->diffInSeconds($this->end_time, false));
    }
}