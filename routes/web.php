<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => false, 
        'canRegister' => false, 
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

<<<<<<< HEAD
Route::get('/inertia-login', function () {
    return Inertia::render('inertia-login');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
=======
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

>>>>>>> 459ddf327a8c43b0e4b152e1532d5adf7c5708ca
