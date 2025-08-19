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
