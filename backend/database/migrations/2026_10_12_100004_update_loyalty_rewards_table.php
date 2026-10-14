<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('loyalty_rewards', function (Blueprint $table) {
            $table->unsignedInteger('milestone')->nullable()->default(0)->change();
            $table->foreignId('catalog_id')->nullable()->after('type')->constrained('loyalty_reward_catalogs')->nullOnDelete();
            $table->string('title')->nullable()->after('catalog_id');
        });
    }

    public function down(): void
    {
        Schema::table('loyalty_rewards', function (Blueprint $table) {
            $table->dropForeign(['catalog_id']);
            $table->dropColumn(['catalog_id', 'title']);
        });
    }
};
