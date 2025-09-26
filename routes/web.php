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
Route::get('/register', fn () => Inertia::render('auth/New_Register'))->name('register');

// Login POST route
Route::post('/login', [AuthController::class, 'login']);

Route::get('/StudentDashboard', fn() => Inertia::render('Student_Dashboard/StudentDashboard'));
    Route::get('/RoomDetails', fn() => Inertia::render('Student_Dashboard/RoomDetails'));
    Route::get('/VotingCentre', fn() => Inertia::render('Student_Dashboard/VotingCentre'));
    Route::get('/VotingDetails/{id}', function ($id) {
        return Inertia::render('Student_Dashboard/VotingDetails', [
            'id' => $id,
        ]);
    })->name('voting.details');
    
    Route::get('/Events', fn() => Inertia::render('Student_Dashboard/Events'));
    Route::get('/EditProfile', fn() => Inertia::render('Student_Dashboard/EditProfile'));
    Route::get('/StudentLayout', fn() => Inertia::render('Student_Dashboard/StudentLayout'));
    Route::get('/Messages', fn() => Inertia::render('Student_Dashboard/Messages'))->name('messages');
    Route::get('/Profile', fn() => Inertia::render('Student_Dashboard/Profile'))->name('profile');
    Route::get('/Notifications', fn() => Inertia::render('Student_Dashboard/Notifications'))->name('notifications');

