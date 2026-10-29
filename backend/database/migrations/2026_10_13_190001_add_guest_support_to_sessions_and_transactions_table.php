<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{

    public function up(): void
    {

        if (Schema::hasTable('sessions')) {
            Schema::table('sessions', function (Blueprint $table) {
                if (!Schema::hasColumn('sessions', 'guest_name')) {
                    $table->string('guest_name')->nullable()->after('user_id');
                }
            });
            DB::statement('ALTER TABLE sessions MODIFY COLUMN user_id BIGINT UNSIGNED NULL;');
        }

        if (Schema::hasTable('transactions')) {
            Schema::table('transactions', function (Blueprint $table) {
                if (!Schema::hasColumn('transactions', 'guest_name')) {
                    $table->string('guest_name')->nullable()->after('user_id');
                }
            });
            DB::statement('ALTER TABLE transactions MODIFY COLUMN user_id BIGINT UNSIGNED NULL;');
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('sessions')) {
            DB::statement('ALTER TABLE sessions MODIFY COLUMN user_id BIGINT UNSIGNED NOT NULL;');
            Schema::table('sessions', function (Blueprint $table) {
                if (Schema::hasColumn('sessions', 'guest_name')) {
                    $table->dropColumn('guest_name');
                }
            });
        }

        if (Schema::hasTable('transactions')) {
            DB::statement('ALTER TABLE transactions MODIFY COLUMN user_id BIGINT UNSIGNED NOT NULL;');
            Schema::table('transactions', function (Blueprint $table) {
                if (Schema::hasColumn('transactions', 'guest_name')) {
                    $table->dropColumn('guest_name');
                }
            });
        }
    }
};
