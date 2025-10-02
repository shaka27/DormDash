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
        Schema::table('vote_option', function (Blueprint $table) {
            $table->unsignedBigInteger('vote_id')->after('id');
            $table->foreign('vote_id')
                  ->references('id')->on('vote')
                  ->onDelete('cascade');
            $table->text('option_text')->after('vote_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vote_option', function (Blueprint $table) {
            $table->dropForeign(['vote_id']);
            $table->dropColumn(['vote_id', 'option_text']);
        });
    }
};
