<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->json('platforms')->nullable()->after('platform');
        });

        // Migrasi data lama: platform (string tunggal) -> platforms (array)
        DB::table('games')->get()->each(function ($game) {
            DB::table('games')
                ->where('id', $game->id)
                ->update(['platforms' => json_encode([$game->platform])]);
        });

        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('platform');
        });
    }

    public function down(): void
    {
        Schema::table('games', function (Blueprint $table) {
            $table->string('platform')->nullable()->after('name');
        });

        DB::table('games')->get()->each(function ($game) {
            $platforms = json_decode($game->platforms, true) ?? [];
            DB::table('games')
                ->where('id', $game->id)
                ->update(['platform' => $platforms[0] ?? null]);
        });

        Schema::table('games', function (Blueprint $table) {
            $table->dropColumn('platforms');
        });
    }
};