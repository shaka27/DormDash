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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();

          
           $table->unsignedBigInteger('sender_id');
           $table->foreign('sender_id')
                 ->references('id')->on('users')
                 ->onDelete('cascade');
            
            // Message content
            $table->text('message');

            // Receiver (nullable, only for private DMs)
           $table->unsignedBigInteger('receiver_id')->nullable();
           $table->foreign('receiver_id')  
                 ->references('id')->on('users')
                 ->onDelete('cascade'); 
        
            // Chatroom (nullable, only for group chat messages)
            $table->unsignedBigInteger('chatroom_id')->nullable();
            $table->foreign('chatroom_id')
                  ->references('id')->on('chatroom')
                  ->onDelete('cascade');


            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
}; 