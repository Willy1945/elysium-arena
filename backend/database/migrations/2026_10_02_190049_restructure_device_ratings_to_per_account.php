<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Reset data lama — struktur berubah dari per-device jadi 1 rating per akun
        DB::table('device_ratings')->truncate();

        Schema::table('device_ratings', function (Blueprint $table) {
            $table->dropForeign(['device_id']);
            $table->dropUnique(['device_id', 'user_id']);
            $table->dropColumn('device_id');
            $table->unique('user_id');
        });
    }

    public function down(): void
    {
        Schema::table('device_ratings', function (Blueprint $table) {
            $table->dropUnique(['user_id']);
            $table->foreignId('device_id')->after('id')->constrained()->cascadeOnDelete();
            $table->unique(['device_id', 'user_id']);
        });
    }
};