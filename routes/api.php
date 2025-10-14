<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\MaintenanceRequestController;

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
Route::get('/user/count', [UserController::class, 'count']);
Route::get('/events/upcoming/count', [EventController::class, 'upcommingEvents']);
Route::get('/vote/activeVotes/count', [VoteController::class, 'activeVotes']);
Route::get('/events/upcoming', [EventController::class, 'upcoming']);
Route::get('/notifications/recent', [NotificationController::class,'recentAnnouncements']);
Route::get('maintenance_requests/pendingRuests',[MaintenanceRequestController::class, 'count']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // EVENT API routes
    Route::post('/events', [App\Http\Controllers\EventController::class, 'store']);
    Route::put('/events/{id}', [App\Http\Controllers\EventController::class, 'update']);
    Route::delete('/events/{id}', [App\Http\Controllers\EventController::class, 'destroy']);



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
    //Route::get('/notifications/recent', [NotificationController::class,'recentAnnouncements']);

        // CHATROOM protected routes
        Route::get('/chatrooms', [App\Http\Controllers\ChatroomController::class, 'index']);
        Route::post('/chatrooms', [App\Http\Controllers\ChatroomController::class, 'store']);
        Route::get('/chatrooms/{id}', [App\Http\Controllers\ChatroomController::class, 'show']);
        Route::put('/chatrooms/{id}', [App\Http\Controllers\ChatroomController::class, 'update']);
        Route::delete('/chatrooms/{id}', [App\Http\Controllers\ChatroomController::class, 'destroy']);

    // MESSAGES protected routes
    Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index']);
    Route::post('/messages', [App\Http\Controllers\MessageController::class, 'store']);
    Route::get('/messages/{id}', [App\Http\Controllers\MessageController::class, 'show']);
    Route::put('/messages/{id}', [App\Http\Controllers\MessageController::class, 'update']);
    Route::delete('/messages/{id}', [App\Http\Controllers\MessageController::class, 'destroy']);

    // VOTING protected routes
    Route::get('/votes', [App\Http\Controllers\VoteController::class, 'index']);
    Route::post('/votes', [App\Http\Controllers\VoteController::class, 'store']);
    Route::get('/votes/{id}', [App\Http\Controllers\VoteController::class, 'show']);
    Route::put('/votes/{id}', [App\Http\Controllers\VoteController::class, 'update']);
    Route::delete('/votes/{id}', [App\Http\Controllers\VoteController::class, 'destroy']);
    Route::post('/votes/submit-response', [App\Http\Controllers\VoteController::class, 'submitResponse']);

});

// CRUD for Users
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [UserController::class, 'index']);
    Route::post('/user', [UserController::class, 'store']);
    Route::put('/user/{id}', [UserController::class, 'update']);
    Route::delete('/user/{id}', [UserController::class, 'destroy']);
});

//tESTING the CORS setup
Route::get('/test-cors', function () {
    return response()->json([
        'message' => 'CORS is working!',
        'status' => 'success',
        'timestamp' => now()
    ]);
});
