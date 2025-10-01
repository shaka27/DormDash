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
        Schema::create('access', function (Blueprint $table) {
            $table->id();
            $table->string('student_number')->unique();
            $table->unsignedBigInteger('residence_id');
            $table->timestamps();

            $table->foreign('residence_id')->references('id')->on('residence')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('access');
    }
};
