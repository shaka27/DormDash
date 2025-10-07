<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;

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
Route::middleware('auth:sanctum')->group(function () {
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
    Route::get('/notifications/count', [NotificationController::class, 'unreadCount']);

        // CHATROOM protected routes
        Route::get('/chatrooms', [App\Http\Controllers\ChatroomController::class, 'index']);
        Route::post('/chatrooms', [App\Http\Controllers\ChatroomController::class, 'store']);
        Route::get('/chatrooms/{id}', [App\Http\Controllers\ChatroomController::class, 'show']);
        Route::put('/chatrooms/{id}', [App\Http\Controllers\ChatroomController::class, 'update']);
        Route::delete('/chatrooms/{id}', [App\Http\Controllers\ChatroomController::class, 'destroy']);

        // MESSAGES protected routes
        Route::get('/messages', [App\Http\Controllers\MessagesController::class, 'index']);
        Route::post('/messages', [App\Http\Controllers\MessagesController::class, 'store']);
        Route::get('/messages/{id}', [App\Http\Controllers\MessagesController::class, 'show']);
        Route::put('/messages/{id}', [App\Http\Controllers\MessagesController::class, 'update']);
        Route::delete('/messages/{id}', [App\Http\Controllers\MessagesController::class, 'destroy']);

        // VOTING protected routes
        Route::get('/votes', [App\Http\Controllers\VotingController::class, 'index']);
        Route::post('/votes', [App\Http\Controllers\VotingController::class, 'store']);
        Route::get('/votes/{id}', [App\Http\Controllers\VotingController::class, 'show']);
        Route::put('/votes/{id}', [App\Http\Controllers\VotingController::class, 'update']);
        Route::delete('/votes/{id}', [App\Http\Controllers\VotingController::class, 'destroy']);
        Route::post('/votes/submit-response', [App\Http\Controllers\VotingController::class, 'submitResponse']);
    
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