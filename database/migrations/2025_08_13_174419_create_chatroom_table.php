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

            // Belongs to a group (if chatrooms are inside groups)
            $table->unsignedBigInteger('group_id')->nullable();
            $table->foreign('group_id')
                  ->references('id')->on('group')
                  ->onDelete('cascade');
            
             // Enforce one chatroom per group
            $table->unique('group_id');
        
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
