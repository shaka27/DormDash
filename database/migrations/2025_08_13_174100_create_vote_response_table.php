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
        Schema::create('vote_response', function (Blueprint $table) {
            $table->id();
             $table->unsignedBigInteger('vote_id');
            $table->foreign('vote_id')
                  ->references('id')->on('vote')
                  ->onDelete('cascade'); 

            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')
                  ->references('id')->on('users')
                  ->onDelete('cascade'); 
                
            $table->unsignedBigInteger('vote_option_id');
            $table->foreign('vote_option_id')
                  ->references('id')->on('vote_option')
                  ->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vote_response');
    }
};
