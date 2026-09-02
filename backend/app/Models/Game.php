<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'platforms',
        'cover_image',
        'description',
    ];

    protected function casts(): array
    {
        return [
            'platforms' => 'array',
        ];
    }

    public function devices()
    {
        return $this->belongsToMany(Device::class, 'device_games');
    }
}