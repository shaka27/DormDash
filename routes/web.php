<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NotificationController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect('/StudentDashboard');
});

Route::middleware('guest')->group(function () {
    Route::get('/login', fn() => Inertia::render('auth/New_Login'))->name('login');
    Route::post('/login', [AuthController::class, 'login']);
});


// Login/Register pages
Route::get('/login', fn () => Inertia::render('auth/New_Login'))->name('login');
Route::get('/register', fn () => Inertia::render('auth/New_Register'))->name('register');

// Login POST route
Route::post('/login', [AuthController::class, 'login']);

Route::get('/StudentDashboard', fn() => Inertia::render('Student_Dashboard/StudentDashboard'));
Route::get('/RoomDetails', fn() => Inertia::render('Student_Dashboard/RoomDetails'));
Route::get('/VotingCentre', fn() => Inertia::render('Student_Dashboard/VotingCentre'));
Route::get('/Events', fn() => Inertia::render('Student_Dashboard/Events'));
Route::get('/StudentLayout', fn() => Inertia::render('Student_Dashboard/StudentLayout'));
Route::get('/Messages', fn() => Inertia::render('Student_Dashboard/Messages'))->name('messages');
Route::get('/Profile', fn() => Inertia::render('Student_Dashboard/Profile'))->name('profile');
Route::get('/Notifications', fn() => Inertia::render('Student_Dashboard/Notifications'))->name('notifications');


// Maintenance Page 
Route::get('/maintenance', function () {
    return Inertia::render('Maintenance/page'); // Must match folder + filename (without .tsx)
})->name('maintenance');


