<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Home page
Route::get('/', fn () => Inertia::render('StudentDashboard'));

// Student dashboard pages
Route::get('/StudentDashboard', fn () => Inertia::render('StudentDashboard'));
Route::get('/RoomDetails', fn () => Inertia::render('RoomDetails'));
Route::get('/VotingCentre', fn () => Inertia::render('VotingCentre'));
Route::get('/Events', fn () => Inertia::render('Events'));
Route::get('/StudentLayout', fn () => Inertia::render('StudentLayout'));
Route::get('/Messages', fn() => Inertia::render('Messages'))->name('messages');
Route::get('/Profile', fn() => Inertia::render('Profile'))->name('profile');
Route::get('/Notifications', fn() => Inertia::render('Notifications'))->name('notifications');