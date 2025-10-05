<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\DormitoryController;
use App\Http\Controllers\ApplicationController;

Route::prefix('admin')->group(function () {
    Route::get('/stats', [StudentController::class, 'getStats']);
    Route::apiResource('students', StudentController::class);
    Route::apiResource('dormitories', DormitoryController::class);
    Route::apiResource('applications', ApplicationController::class);
    Route::patch('applications/{id}/status', [ApplicationController::class, 'updateStatus']);
});