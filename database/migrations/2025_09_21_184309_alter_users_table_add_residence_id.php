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
        Schema::table('users', function (Blueprint $table) {
            $table->unsignedBigInteger('residence_id')->nullable();
            $table->foreign('residence_id')->references('id')->on('residence')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
{
    Schema::table('users', function (Blueprint $table) {
        // Drop the foreign key first
        $table->dropForeign(['residence_id']);

        // Then drop the column
        $table->dropColumn('residence_id');
    });
}

};
