<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Sanctum CSRF cookie endpoint (for SPA auth)
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('sanctum.csrf-cookie');

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
Route::post('/register', [UserController::class, 'store']);


// Authenticated routes
Route::middleware('auth')->group(function () {
    // Logout route
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Residence selection for admins (no middleware required)
    Route::get('/residence-overview', [App\Http\Controllers\ResidenceController::class, 'overview'])->name('residence.overview');
    Route::post('/residence/select', [App\Http\Controllers\ResidenceController::class, 'select'])->name('residence.select');

    // All residence-specific routes - require residence to be selected for admins
    Route::middleware('residence.selected')->group(function () {
        // Student Dashboard – pass the authenticated user to the page
        Route::get('/StudentDashboard', fn() => Inertia::render('Student_Dashboard/StudentDashboard'));

        Route::get('/rooms', [App\Http\Controllers\RoomController::class, 'index'])->name('rooms.index');
        Route::get('/rooms/{room}/room-details', [App\Http\Controllers\RoomController::class, 'getRoomDetailsPage'])->name('room.details');
        Route::get('/notifications',[App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
        Route::post('/notifications', [App\Http\Controllers\NotificationController::class, 'store'])->name('notifications.store');
        Route::put('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'update'])->name('notifications.update');
        Route::delete('/notifications/{id}', [App\Http\Controllers\NotificationController::class, 'destroy'])->name('notifications.destroy');
        Route::get('/voting-centre', [App\Http\Controllers\VoteController::class, 'index'])->name('voting-centre.index');
        Route::get('/voting-centre/{vote}/voting-details', [App\Http\Controllers\VoteController::class, 'getVotingDetailsPage'])->name('voting-centre.details');
        Route::post('/voting-centre', [App\Http\Controllers\VoteController::class, 'store'])->name('voting-centre.store');
        Route::put('/voting-centre/{vote}', [App\Http\Controllers\VoteController::class, 'update'])->name('voting-centre.update');
        Route::delete('/voting-centre/{vote}', [App\Http\Controllers\VoteController::class, 'destroy'])->name('voting-centre.destroy');
        Route::post('/voting-centre/{vote}/submit', [App\Http\Controllers\VoteController::class, 'submitVote'])->name('voting-centre.submit');
        Route::get('/events', [App\Http\Controllers\EventController::class, 'index'])->name('events.index');
        Route::get('/events/{event}/event-details', [App\Http\Controllers\EventController::class, 'getEventDetailsPage'])->name('events.details');
        Route::get('/StudentLayout', fn() => Inertia::render('Student_Dashboard/StudentLayout'));
        Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
        Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
        Route::get('/profile/edit', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

        // Maintenance requests
        Route::get('/maintenance-requests', [App\Http\Controllers\MaintenanceRequestController::class, 'index'])->name('maintenance.index');
        Route::get('/maintenance-requests/create', [App\Http\Controllers\MaintenanceRequestController::class, 'create'])->name('maintenance.create');
        Route::post('/maintenance-requests', [App\Http\Controllers\MaintenanceRequestController::class, 'store'])->name('maintenance.store');

        Route::get('/residence-management', [App\Http\Controllers\ResidenceManagementController::class, 'index'])->name('residence-management.index');


        // Residence Management - Only for Admin, HouseParent, HouseCommittee

            Route::post('/residence-management/access', [App\Http\Controllers\ResidenceManagementController::class, 'addAccess'])->name('residence-management.access.add');
            Route::post('/residence-management/access/import', [App\Http\Controllers\ResidenceManagementController::class, 'importAccess'])->name('residence-management.access.import');
            Route::delete('/residence-management/access/{id}', [App\Http\Controllers\ResidenceManagementController::class, 'deleteAccess'])->name('residence-management.access.delete');

            /* ==========================
         * USER MANAGEMENT ROUTES
         * ========================== */
        Route::get('/user-management', fn() => Inertia::render('Student_Dashboard/UserManagement'))->name('user-management.index');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');

    });
});


// Maintenance Page
Route::get('/maintenance', function () {
    // Example: Pass the current user role from backend auth/session
    // Replace 'student' with actual logic from your backend
    $userRole = auth()->check() && auth()->user()->is_admin ? 'admin' : 'student';

    return Inertia::render('Maintenance/page', [
        'role' => $userRole,
    ]);
})->name('maintenance');