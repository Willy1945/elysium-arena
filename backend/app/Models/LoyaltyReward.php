<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyReward extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'milestone', 'type', 'status',
        'catalog_id', 'title',
        'redeemed_booking_id', 'redeemed_order_id', 'redeemed_at',
    ];

    protected $casts = [
        'redeemed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function catalog()
    {
        return $this->belongsTo(LoyaltyRewardCatalog::class, 'catalog_id');
    }
}