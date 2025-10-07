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
            $table->string('type');
            $table->text('content');
            $table->boolean('is_read')->default(false);

            // Sender (creator of the notification)
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Recipient (who receives it)
            $table->foreignId('recipient_id')
                  ->constrained('users')
                  ->onDelete('cascade');

            // Residence context (optional but used in controller)
            $table->foreignId('residence_id')
                  ->constrained('residence')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};