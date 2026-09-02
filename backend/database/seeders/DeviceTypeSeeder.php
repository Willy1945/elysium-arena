<?php

namespace Database\Seeders;

use App\Models\DeviceType;
use Illuminate\Database\Seeder;

class DeviceTypeSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['PS5', 'PS4', 'PC'] as $type) {
            DeviceType::firstOrCreate(['name' => $type]);
        }
    }
}