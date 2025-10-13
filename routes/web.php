<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MaintenanceRequestController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\MessageController;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Controllers\NotificationController;

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

    // ========================================
    // ADMIN NOTIFICATION MANAGEMENT PAGE
    // ========================================
    // Admin notification management page (Inertia view with all residences)
    Route::get('/admin/notifications', function () {
        $residences = \App\Models\Residence::all();
        return Inertia::render('Admin/AdminNotification', [
            'residences' => $residences
        ]);
    })->name('admin.notifications.page');

    // ========================================
    // ADMIN NOTIFICATION API ROUTES (JSON)
    // ========================================
    Route::prefix('admin')->group(function () {
        // Get all notifications for a specific residence
        Route::get('residences/{residence}/notifications', [NotificationController::class, 'adminIndex'])
            ->name('admin.residences.notifications.index');

        // Create notification for a residence
        Route::post('residences/{residence}/notifications', [NotificationController::class, 'store'])
            ->name('admin.residences.notifications.store');

        // Update specific notification
        Route::put('notifications/{notification}', [NotificationController::class, 'update'])
            ->name('admin.notifications.update');

        // Delete specific notification
        Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])
            ->name('admin.notifications.destroy');
    });

    // MAINTENANCE ROUTES
    Route::get('/maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance.index');
    Route::get('/maintenance/create', [MaintenanceRequestController::class, 'create'])->name('maintenance.create');
    Route::post('/maintenance', [MaintenanceRequestController::class, 'store'])->name('maintenance.store');
    
    // Admin maintenance routes
    Route::get('/admin/maintenance', [MaintenanceRequestController::class, 'adminIndex'])->name('admin.maintenance.index');
    Route::patch('/admin/maintenance/{maintenanceRequest}', [MaintenanceRequestController::class, 'update'])->name('admin.maintenance.update');

    // ========================================
    // STUDENT NOTIFICATION API ROUTES
    // ========================================
    Route::prefix('api')->group(function () {
        Route::get('notifications/count', [NotificationController::class, 'count'])->name('api.notifications.count');
        Route::get('notifications/recent', [NotificationController::class, 'recent'])->name('api.notifications.recent');
        Route::post('notifications/{notification}/read', [NotificationController::class, 'markAsRead'])->name('api.notifications.read');
        Route::delete('/notifications/clear-all', [NotificationController::class, 'clearAll'])->name('notifications.clearAll');

    });

    // All residence-specific routes - require residence to be selected for admins
    Route::middleware('residence.selected')->group(function () {
        // Student Dashboard
        Route::get('/StudentDashboard', fn() => Inertia::render('Student_Dashboard/StudentDashboard'));

        Route::get('/rooms', [App\Http\Controllers\RoomController::class, 'index'])->name('rooms.index');
        Route::get('/rooms/{room}/room-details', [App\Http\Controllers\RoomController::class, 'getRoomDetailsPage'])->name('room.details');
        
        // Student notifications page (Inertia view - for students to VIEW notifications)
        Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
        
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