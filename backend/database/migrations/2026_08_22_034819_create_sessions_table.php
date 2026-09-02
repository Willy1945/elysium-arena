<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('booking_id')->nullable()->constrained('bookings')->nullOnDelete();
            $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('device_id')->constrained('devices')->restrictOnDelete();
            $table->dateTime('start_time');
            $table->dateTime('end_time'); // dipakai untuk hitung timer, bukan setInterval polos
            $table->unsignedInteger('duration'); // menit, ter-update tiap extend
            $table->unsignedInteger('price');
            $table->enum('status', ['active', 'completed'])->default('active');
            $table->timestamps();

            $table->index(['device_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
