<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ResidenceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidenceManagementController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

// Sanctum CSRF cookie endpoint (for SPA auth)
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show'])->name('sanctum.csrf-cookie');

// Root route - redirect to login
Route::get('/', function () {
    if (auth()->check()) {
        // User is logged in - check if they have selected a residence
        if (session()->has('selected_residence_id')) {
            return redirect('/StudentDashboard');
        }
        return redirect('/residence-overview');
    }
    // User is not logged in
    return redirect('/login');
});

// Guest Routes (Login & Register)
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('auth/New_Login');
    })->name('login');

    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/register', fn () => Inertia::render('auth/New_Register'))->name('register');
    Route::post('/register', [UserController::class, 'store']);
});

// -------------------------------------------------
// Authenticated Routes
// -------------------------------------------------
Route::middleware('auth')->group(function () {
    // ADMIN RESIDENCE OVERVIEW (FOR SELECTION)
    Route::get('/residence-overview', [ResidenceController::class, 'overview'])
        ->name('residence.overview');

    Route::post('/residence/select', [ResidenceController::class, 'select'])
        ->name('residence.select');

    // Admin Notifications Page
    Route::get('/admin/notifications', function () {
        $residences = \App\Models\Residence::all();
        return Inertia::render('Admin/AdminNotification', [
            'residences' => $residences
        ]);
    })->name('admin.notifications.page');

    // Admin Notification API Routes
    Route::prefix('admin')->group(function () {
        Route::get('residences/{residence}/notifications', [NotificationController::class, 'adminIndex'])
            ->name('admin.residences.notifications.index');
        Route::post('residences/{residence}/notifications', [NotificationController::class, 'store'])
            ->name('admin.residences.notifications.store');
        Route::put('notifications/{notification}', [NotificationController::class, 'update'])
            ->name('admin.notifications.update');
        Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])
            ->name('admin.notifications.destroy');
    });
    
    // Logout
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // Student Notification API Routes
    Route::prefix('api')->group(function () {
        Route::get('notifications/count', [NotificationController::class, 'count'])
            ->name('api.notifications.count');
        Route::get('notifications/recent', [NotificationController::class, 'recent'])
            ->name('api.notifications.recent');
        Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
            ->name('api.notifications.read');
        Route::delete('notifications/clear-all', [NotificationController::class, 'clearAll'])
            ->name('notifications.clearAll');
    });

    // Maintenance Routes
    Route::get('/maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance.index');
    Route::get('/maintenance/create', [MaintenanceRequestController::class, 'create'])->name('maintenance.create');
    Route::post('/maintenance', [MaintenanceRequestController::class, 'store'])->name('maintenance.store');
    Route::get('/admin/maintenance', [MaintenanceRequestController::class, 'adminIndex'])->name('admin.maintenance.index');
    Route::patch('/admin/maintenance/{maintenanceRequest}', [MaintenanceRequestController::class, 'update'])->name('admin.maintenance.update');

    // Routes Requiring Residence Selection
    Route::middleware('residence.selected')->group(function () {
        // Student Dashboard
        Route::get('/StudentDashboard', fn() => Inertia::render('Student_Dashboard/StudentDashboard'));

        Route::get('/rooms', [App\Http\Controllers\RoomController::class, 'studentIndex'])->name('rooms.index');
        // Admin Rooms: list all rooms for the selected residence
        Route::get('/admin/rooms', [App\Http\Controllers\RoomController::class, 'adminIndex'])->name('admin.rooms.index');
        Route::get('/rooms/{room}/room-details', [App\Http\Controllers\RoomController::class, 'getRoomDetailsPage'])->name('room.details');
        //Notifications
        Route::get('/notifications',[App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
        Route::get('/notifications/{notification}', [App\Http\Controllers\NotificationController::class, 'show'])->name('notifications.show');
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
        Route::get('/events/create', [App\Http\Controllers\EventController::class, 'create'])->name('events.create');
        Route::post('/events', [App\Http\Controllers\EventController::class, 'store'])->name('events.store');
        Route::get('/events/{event}/event-details', [App\Http\Controllers\EventController::class, 'getEventDetailsPage'])->name('events.details');
        Route::get('/StudentLayout', fn() => Inertia::render('Student_Dashboard/StudentLayout'));
        Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
        Route::get('/profile', [App\Http\Controllers\ProfileController::class, 'index'])->name('profile.index');
        Route::get('/profile/edit', [App\Http\Controllers\ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/profile', [App\Http\Controllers\ProfileController::class, 'update'])->name('profile.update');

        // Residence Management
        Route::get('/residence-management', [ResidenceManagementController::class, 'index'])->name('residence-management.index');
        Route::post('/residence-management/access', [ResidenceManagementController::class, 'addAccess'])->name('residence-management.access.add');
        Route::post('/residence-management/access/import', [ResidenceManagementController::class, 'importAccess'])->name('residence-management.access.import');
        Route::delete('/residence-management/access/{id}', [ResidenceManagementController::class, 'deleteAccess'])->name('residence-management.access.delete');

        // User Management
        Route::get('/user-management', fn () => Inertia::render('Student_Dashboard/UserManagement'))->name('user-management.index');
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::get('/users/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('users.show');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});
