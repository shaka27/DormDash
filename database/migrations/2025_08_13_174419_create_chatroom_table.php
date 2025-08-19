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
        Schema::create('chatroom', function (Blueprint $table) {
            $table->id();

             $table->string('name');
             $table->string('description');


            $table->unsignedBigInteger('group_id');
            $table->foreign('group_id')
                  ->references('id')->on('group')
                  ->onDelete('cascade'); 

             $table->unsignedBigInteger('residence_id');
            $table->foreign('residence_id')
                  ->references('id')->on('residence')
                  ->onDelete('cascade'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chatroom');
    }
};
