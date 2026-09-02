<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_type_id')->constrained('device_types')->restrictOnDelete();
            $table->string('code'); // "PS5 #01"
            $table->unsignedInteger('price_per_hour');
            $table->enum('status', ['available', 'booked', 'occupied', 'maintenance'])
                ->default('available');
            $table->string('photo')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();

            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('devices');
    }
};
