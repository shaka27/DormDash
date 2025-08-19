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
        Schema::create('residence', function (Blueprint $table) {
            $table->id();
            $table->string('name');


            $table->unsignedBigInteger('campus_id');
            $table->foreign('campus_id')
                  ->references('id')->on('campus')
                  ->onDelete('cascade'); 

            // FK -> room.room_id (replaces role_id)
            $table->unsignedBigInteger('room_id');
            $table->foreign('room_id')
                  ->references('room_id')->on('room')
                  ->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('residence');
    }
};
