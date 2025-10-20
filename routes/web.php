<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

use App\Http\Controllers\MaintenanceRequestController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ResidenceController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ResidenceManagementController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Keep your app routes here. This file fixes/adds routes used by the
| Notifications (student) pages and the admin notification APIs.
|
*/

// Student-facing (Inertia) notification pages
Route::middleware('auth')->group(function () {
    // Inertia page that lists notifications for the authenticated student's residence
    Route::get('/notifications', [NotificationController::class, 'index'])
        ->name('notifications.index');

    // Inertia page to view a single notification
    Route::get('/notifications/{notification}', [NotificationController::class, 'show'])
        ->name('notifications.show');

    // JSON endpoints used by frontend (fetch recent/count/mark-as-read)
    // These return JSON and are protected by session auth
    Route::get('/api/notifications/recent', [NotificationController::class, 'recent'])
        ->name('api.notifications.recent');

    Route::get('/api/notifications/count', [NotificationController::class, 'count'])
        ->name('api.notifications.count');

    Route::post('/api/notifications/{notification}/read', [NotificationController::class, 'markAsRead'])
        ->name('api.notifications.read');
});

// Admin notification management (CRUD) for selected residence
// Controller also performs admin checks; kept behind auth middleware here
Route::middleware('auth')->prefix('admin')->group(function () {
    // list notifications for a specific residence (JSON)
    Route::get('residences/{residenceId}/notifications', [NotificationController::class, 'adminIndex'])
        ->name('admin.residence.notifications.index');

    // create a notification for a residence
    Route::post('residences/{residenceId}/notifications', [NotificationController::class, 'store'])
        ->name('admin.residence.notifications.store');

    // update / delete by notification id
    Route::put('notifications/{notification}', [NotificationController::class, 'update'])
        ->name('admin.notifications.update');

    Route::delete('notifications/{notification}', [NotificationController::class, 'destroy'])
        ->name('admin.notifications.destroy');
});

/*
|--------------------------------------------------------------------------
| Other app routes...
|--------------------------------------------------------------------------
| Re-add other routes below (auth routes, profile, residence management, etc.)
| if they existed previously in this file.
|
*/

// Sanctum CSRF cookie endpoint (for SPA auth)
Route::get('/sanctum/csrf-cookie', [Laravel\Sanctum\Http\Controllers\CsrfCookieController::class, 'show'])->name('sanctum.csrf-cookie');

// Guest Routes (Login & Register)
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

// Authenticated Routes
Route::middleware('auth')->group(function () {
    // Logout route
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

    // ADMIN RESIDENCE OVERVIEW (FOR SELECTION)
    Route::get('/residence-overview', [App\Http\Controllers\ResidenceController::class, 'overview'])->name('residence.overview');
    Route::post('/residence/select', [App\Http\Controllers\ResidenceController::class, 'select'])->name('residence.select');

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
        Route::get('/notifications/count', [App\Http\Controllers\NotificationController::class, 'unreadCount'])->name('notifications.unreadCount');
        
        Route::get('/voting-centre', [App\Http\Controllers\VoteController::class, 'index'])->name('voting-centre.index');
        Route::get('/voting-centre/{vote}/voting-details', [App\Http\Controllers\VoteController::class, 'getVotingDetailsPage'])->name('voting-centre.details');
        Route::post('/voting-centre', [App\Http\Controllers\VoteController::class, 'store'])->name('voting-centre.store');
        Route::put('/voting-centre/{vote}', [App\Http\Controllers\VoteController::class, 'update'])->name('voting-centre.update');
        Route::delete('/voting-centre/{vote}', [App\Http\Controllers\VoteController::class, 'destroy'])->name('voting-centre.destroy');
        Route::post('/voting-centre/{vote}/submit', [App\Http\Controllers\VoteController::class, 'submitVote'])->name('voting-centre.submit');
        
        // EVENT ROUTES
        Route::get('/events', [App\Http\Controllers\EventController::class, 'index'])->name('events.index');
        Route::get('/events/create', [App\Http\Controllers\EventController::class, 'create'])->name('events.create');
        Route::post('/events', [App\Http\Controllers\EventController::class, 'store'])->name('events.store');
        Route::get('/events/{event}/edit', [App\Http\Controllers\EventController::class, 'edit'])->name('events.edit');
        Route::put('/events/{event}', [App\Http\Controllers\EventController::class, 'update'])->name('events.update');
        Route::delete('/events/{event}', [App\Http\Controllers\EventController::class, 'destroy'])->name('events.destroy');
        Route::get('/events/{event}/event-details', [App\Http\Controllers\EventController::class, 'getEventDetailsPage'])->name('events.details');
        Route::post('/events/{event}/rsvp', [App\Http\Controllers\EventController::class, 'rsvp']);
        Route::delete('/events/{event}/rsvp', [App\Http\Controllers\EventController::class, 'cancelRsvp']);
        
        Route::get('/StudentLayout', fn() => Inertia::render('Student_Dashboard/StudentLayout'));

        // MESSAGE ROUTES
        Route::get('/messages', [App\Http\Controllers\MessageController::class, 'index'])->name('messages.index');
        Route::post('/messages', [App\Http\Controllers\MessageController::class, 'store'])->name('messages.store');
        Route::get('/messages/chatroom/{chatroomId}', [App\Http\Controllers\MessageController::class, 'showChatroom'])->name('messages.chatroom');
        Route::get('/messages/direct/{userId}', [App\Http\Controllers\MessageController::class, 'showDirectMessages'])->name('messages.direct');

        // GROUP ROUTES
        Route::post('/groups', [App\Http\Controllers\GroupController::class, 'store'])->name('groups.store');

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
         * ================= */
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

// Inertia pages (already present)
Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
Route::get('/notifications/{notification}', [App\Http\Controllers\NotificationController::class, 'show'])->name('notifications.show');

// JSON endpoints used by frontend
Route::get('/notifications/count', [App\Http\Controllers\NotificationController::class, 'count'])->name('notifications.count');
Route::get('/notifications/recent', [App\Http\Controllers\NotificationController::class, 'recent'])->name('notifications.recent');
// Mark as read
Route::post('/notifications/{notification}/read', [App\Http\Controllers\NotificationController::class, 'markAsRead'])->name('notifications.read');
// Simple "login" creation endpoint (frontend called /api/notifications/login previously)
Route::post('/api/notifications/login', [App\Http\Controllers\NotificationController::class, 'loginNotification'])->name('notifications.login');

Route::middleware(['auth'])->group(function () {
    Route::middleware('residence.selected')->group(function () {
        Route::get('/notifications', [App\Http\Controllers\NotificationController::class, 'index'])->name('notifications.index');
        Route::get('/notifications/{notification}', [App\Http\Controllers\NotificationController::class, 'show'])->name('notifications.show');

        // JSON endpoint used by the student page to refresh
        Route::get('/notifications/recent', [App\Http\Controllers\NotificationController::class, 'recent'])->name('notifications.recent');

        // unread count endpoint (if used)
        Route::get('/notifications/count', [App\Http\Controllers\NotificationController::class, 'count'])->name('notifications.count');
    });
});