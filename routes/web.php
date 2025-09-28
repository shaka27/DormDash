<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => Inertia::render('auth/New_Login'))->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Make the login page route as the main entry page
Route::get('/', function () {
    return redirect()->route('login');
});

// Login/Register pages
Route::get('/login', fn () => Inertia::render('auth/New_Login'))->name('login');
Route::post('/login', [AuthController::class, 'login']);
Route::get('/register', fn () => Inertia::render('auth/New_Register'))->name('register');

// Authenticated routes
Route::middleware('auth')->group(function () {
    // TODO: Associate all routes with a specific residence

    // Student Dashboard – pass the authenticated user to the page
    Route::get('/StudentDashboard', fn() => Inertia::render('Student_Dashboard/StudentDashboard'));

    Route::get('/rooms', [App\Http\Controllers\RoomController::class, 'index'])->name('rooms.index');
    Route::get('/rooms/{room}/room-details', [App\Http\Controllers\RoomController::class, 'getRoomDetailsPage'])->name('room.details');
    Route::get('/notifications',[App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
    Route::get('/voting-centre', [App\Http\Controllers\VoteController::class, 'index'])->name('voting-centre.index');
    Route::get('/voting-centre/{vote}/voting-details', [App\Http\Controllers\VoteController::class, 'getVotingDetailsPage'])->name('voting-centre.details');
    Route::get('/events', [App\Http\Controllers\EventController::class, 'index'])->name('events.index');
    Route::get('/events/{event}/event-details', [App\Http\Controllers\EventController::class, 'getEventDetailsPage'])->name('events.details');
    Route::get('/StudentLayout', fn() => Inertia::render('Student_Dashboard/StudentLayout'));
    Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
    Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
});


// Maintenance Page 
Route::get('/maintenance', function () {
    return Inertia::render('Maintenance/page'); // Must match folder + filename (without .tsx)
})->name('maintenance');