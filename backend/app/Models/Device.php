<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_type_id',
        'code',
        'price_per_hour',
        'status',
        'photo',
        'description',
    ];

    protected $hidden = [
        'client_token',
    ];

    public function deviceType()
    {
        return $this->belongsTo(DeviceType::class);
    }

    public function games()
    {
        return $this->belongsToMany(Game::class, 'device_games');
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function sessions()
    {
        return $this->hasMany(GamingSession::class);
    }

    public function maintenanceLogs()
    {
        return $this->hasMany(Maintenance::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function regenerateClientToken(): string
    {
        $token = Str::random(48);
        $this->client_token = $token;
        $this->save();

        return $token;
    }
}