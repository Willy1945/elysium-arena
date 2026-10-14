<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoyaltyRewardCatalog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'points_required',
        'reward_type',
        'value',
        'icon',
        'is_active',
    ];

    protected $casts = [
        'points_required' => 'integer',
        'value' => 'integer',
        'is_active' => 'boolean',
    ];

    public function rewards()
    {
        return $this->hasMany(LoyaltyReward::class, 'catalog_id');
    }
}
