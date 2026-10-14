<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('loyalty_reward_catalogs', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->unsignedInteger('points_required');
            $table->string('reward_type'); // free_hour, free_2_hours, free_food
            $table->unsignedInteger('value')->default(1); // 1 jam, 2 jam, etc.
            $table->string('icon')->default('gamepad'); // gamepad, utensils, coffee, spark
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('loyalty_reward_catalogs');
    }
};
