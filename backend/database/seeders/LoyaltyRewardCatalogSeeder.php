<?php

namespace Database\Seeders;

use App\Models\LoyaltyRewardCatalog;
use Illuminate\Database\Seeder;

class LoyaltyRewardCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            [
                'title' => 'Gratis 1 Jam Bermain',
                'description' => 'Voucher gratis sewa station gaming selama 1 jam penuh. Berlaku untuk PC & PlayStation 5.',
                'points_required' => 2000,
                'reward_type' => 'free_hour',
                'value' => 1,
                'icon' => 'gamepad',
                'is_active' => true,
            ],
            [
                'title' => 'Gratis 2 Jam Bermain',
                'description' => 'Voucher hemat istimewa! Dapatkan 2 jam bermain game sepuasnya tanpa biaya sewa station.',
                'points_required' => 2500,
                'reward_type' => 'free_2_hours',
                'value' => 2,
                'icon' => 'gamepad',
                'is_active' => true,
            ],
            [
                'title' => 'Gratis Mie Goreng Spesial Kafe',
                'description' => 'Voucher gratis 1 porsi Mie Goreng Spesial lezat dari kafe Elysium Arena.',
                'points_required' => 1500,
                'reward_type' => 'free_food',
                'value' => 1,
                'icon' => 'utensils',
                'is_active' => true,
            ],
            [
                'title' => 'Gratis Minuman Segar Kafe',
                'description' => 'Voucher gratis 1 minuman dingin atau kopi pilihan dari kafe Elysium Arena.',
                'points_required' => 1000,
                'reward_type' => 'free_food',
                'value' => 1,
                'icon' => 'coffee',
                'is_active' => true,
            ],
        ];

        foreach ($items as $item) {
            LoyaltyRewardCatalog::updateOrCreate(
                ['title' => $item['title']],
                $item
            );
        }
    }
}
