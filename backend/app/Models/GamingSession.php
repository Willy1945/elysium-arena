<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamingSession extends Model
{
    use HasFactory;

    protected $table = 'sessions';

    protected $fillable = [
        'booking_id',
        'user_id',
        'guest_name',
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

    public function getRemainingSecondsAttribute(): int
    {
        return max(0, now()->diffInSeconds($this->end_time, false));
    }
}