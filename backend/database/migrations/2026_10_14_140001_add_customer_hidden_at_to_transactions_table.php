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
        if (Schema::hasTable('transactions') && !Schema::hasColumn('transactions', 'customer_hidden_at')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->timestamp('customer_hidden_at')->nullable()->after('hidden_at');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (Schema::hasTable('transactions') && Schema::hasColumn('transactions', 'customer_hidden_at')) {
            Schema::table('transactions', function (Blueprint $table) {
                $table->dropColumn('customer_hidden_at');
            });
        }
    }
};
