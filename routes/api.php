<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes (require authentication)
// Using 'auth:sanctum,web' to support both API tokens and web session authentication
Route::middleware('auth:sanctum,web')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // RESIDENCE protected routes here
    Route::get('/residences', [App\Http\Controllers\ResidenceController::class, 'index']);
    Route::post('/residences', [App\Http\Controllers\ResidenceController::class, 'store']);
    Route::get('/residences/{id}', [App\Http\Controllers\ResidenceController::class, 'show']);  //Display single specific residence
    Route::put('/residences/{id}', [App\Http\Controllers\ResidenceController::class, 'update']);
    Route::delete('/residences/{id}', [App\Http\Controllers\ResidenceController::class, 'destroy']);

    //ROOM protected routes here
    Route::get('/rooms', [App\Http\Controllers\RoomController::class, 'index']);
    Route::post('/rooms', [App\Http\Controllers\RoomController::class, 'store']);
    Route::get('/rooms/{id}', [App\Http\Controllers\RoomController::class, 'show']);  //Display single specific room
    Route::put('/rooms/{id}', [App\Http\Controllers\RoomController::class,  'update']);
    Route::delete('/rooms/{id}', [App\Http\Controllers\RoomController::class, 'destroy']);

    //NOTIFICATION protected routes here
    Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index']);
    Route::post('/notifications', [App\Http\Controllers\NotificationController::class, 'store']);
    Route::get('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'show']);  //Display single specific notification
    Route::put('/notifications/{id}', [App\Http\Controllers\NotificationController::class,  'update']);
    Route::delete('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'destroy']);



});

// CRUD for Users
Route::apiResource('users', UserController::class);

//tESTING the CORS setup
Route::get('/test-cors', function () {
    return response()->json([
        'message' => 'CORS is working!', 
        'status' => 'success',
        'timestamp' => now()
    ]);
});