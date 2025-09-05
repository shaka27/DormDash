<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', fn () => Inertia::render('auth/New_Login'));

Route::get('/login', function () {
    return Inertia::render('auth/New_Login');
});

Route::get('/register', function () {
    return Inertia::render('auth/New_Register');
});
// Student dashboard pages
Route::get('/StudentDashboard', fn () => Inertia::render('Student_Dashboard/StudentDashboard'));
Route::get('/RoomDetails', fn () => Inertia::render('Student_Dashboard/RoomDetails'));
Route::get('/VotingCentre', fn () => Inertia::render('Student_Dashboard/VotingCentre'));
Route::get('/Events', fn () => Inertia::render('Student_Dashboard/Events'));
Route::get('/StudentLayout', fn () => Inertia::render('Student_Dashboard/StudentLayout'));
Route::get('/Messages', fn() => Inertia::render('Student_Dashboard/Messages'))->name('messages');
Route::get('/Profile', fn() => Inertia::render('Student_Dashboard/Profile'))->name('profile');
Route::get('/Notifications', fn() => Inertia::render('Student_Dashboard/Notifications'))->name('notifications');