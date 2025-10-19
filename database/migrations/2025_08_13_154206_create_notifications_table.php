<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            
            // Notification details
            $table->string('type'); // announcement, technical, reminder, maintenance
            $table->text('content');
            $table->boolean('is_read')->default(false);

            // Sender (creator of the notification - typically an admin)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Recipient (optional - if null, it's a broadcast to all in residence)
            $table->foreignId('recipient_id')
                  ->nullable()
                  ->constrained('users')
                  ->onDelete('cascade');

            // Residence context (required)
            $table->foreignId('residence_id')
                  ->constrained('residence')
                  ->onDelete('cascade');

            $table->timestamps();

            // Indexes for better query performance
            $table->index(['residence_id', 'is_read']);
            $table->index(['user_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};