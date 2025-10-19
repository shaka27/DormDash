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
            // Add chatroom_id column after receiver_id
            $table->unsignedBigInteger('chatroom_id')->nullable()->after('receiver_id');
            $table->foreign('chatroom_id')
                  ->references('id')->on('chatroom')
                  ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('messages', function (Blueprint $table) {
            $table->dropForeign(['chatroom_id']);
            $table->dropColumn('chatroom_id');
        });
    }
};
