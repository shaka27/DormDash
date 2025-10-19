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
        Schema::table('messages', function (Blueprint $table) {
            // Change message column from varchar(255) to text
            $table->text('message')->change();

            // Make receiver_id nullable if not already
            $table->unsignedBigInteger('receiver_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            // Revert message column to varchar(255)
            $table->string('message', 255)->change();

            // Revert receiver_id to not nullable
            $table->unsignedBigInteger('receiver_id')->nullable(false)->change();
        });
    }
};
