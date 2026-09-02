<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $ownerRole = Role::where('name', 'OWNER')->first();
        $adminRole = Role::where('name', 'ADMIN')->first();
        $staffRole = Role::where('name', 'STAFF_CAFE')->first();

        User::firstOrCreate(
            ['email' => 'owner@elysiumarena.com'],
            [
                'role_id' => $ownerRole->id,
                'name' => 'Owner Elysium Arena',
                'phone' => '081234567890',
                'password' => Hash::make('password123'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'admin@elysiumarena.com'],
            [
                'role_id' => $adminRole->id,
                'name' => 'Admin Elysium Arena',
                'phone' => '081234567891',
                'password' => Hash::make('password123'),
            ]
        );

        User::firstOrCreate(
            ['email' => 'cafe@elysiumarena.com'],
            [
                'role_id' => $staffRole->id,
                'name' => 'Staff Cafe Elysium Arena',
                'phone' => '081234567892',
                'password' => Hash::make('password123'),
            ]
        );
    }
}