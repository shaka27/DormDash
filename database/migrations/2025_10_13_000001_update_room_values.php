<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Add missing columns if they don't exist
        Schema::table('room', function (Blueprint $table) {
            if (!Schema::hasColumn('room', 'capacity')) {
                $table->unsignedTinyInteger('capacity')->nullable()->after('number');
            }
            if (!Schema::hasColumn('room', 'type')) {
                $table->string('type')->nullable()->after('capacity');
            }
            if (!Schema::hasColumn('room', 'floor')) {
                $table->unsignedTinyInteger('floor')->nullable()->after('type');
            }
        });

        // Normalize data values
        DB::table('room')->update(['type' => 'Residence']);
        DB::table('room')->update(['capacity' => 3]);
    }

    public function down(): void
    {
        Schema::table('room', function (Blueprint $table) {
            if (Schema::hasColumn('room', 'floor')) {
                $table->dropColumn('floor');
            }
            if (Schema::hasColumn('room', 'type')) {
                $table->dropColumn('type');
            }
            if (Schema::hasColumn('room', 'capacity')) {
                $table->dropColumn('capacity');
            }
        });
    }
};
