<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Events\NotificationCreated;
use App\Events\NotificationUpdated;
use App\Events\NotificationDeleted;

class NotificationController extends Controller
{
    protected function userIsAdmin(): bool
    {
        $user = Auth::user();
        if (! $user) return false;
        if (method_exists($user, 'roles')) {
            return $user->roles->pluck('description')->contains('Admin');
        }
        return (bool) ($user->is_admin ?? false);
    }

    /**
     * Student view: show notifications for the user's residence.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $residenceId = $user->residence_id ?? session('selected_residence_id') ?? null;

        $notifications = $residenceId
            ? Notification::where('residence_id', $residenceId)
                ->with('sender')
                ->orderByDesc('created_at')
                ->get()
            : collect([]);

        return Inertia::render('Student_Dashboard/Notifications', [
            'notifications' => $notifications,
            'user' => $user,
            'canManage' => $this->userIsAdmin(),
        ]);
    }

    /**
     * Student-facing Inertia detail page
     */
    public function show(Notification $notification)
    {
        // Optionally authorize that user belongs to same residence here
        return Inertia::render('Student_Dashboard/NotificationDetails', [
            'notification' => $notification,
        ]);
    }

    /**
     * JSON endpoint used by frontend to get unread count
     */
    public function count(Request $request)
    {
        $user = $request->user() ?? auth()->user();
        $residenceId = $user->residence_id ?? session('selected_residence_id') ?? null;

        if (! $residenceId) {
            return response()->json(['count' => 0]);
        }

        $count = \App\Models\Notification::where('residence_id', $residenceId)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Backwards-compatible alias if routes call unreadCount
     */
    public function unreadCount(Request $request)
    {
        return $this->count($request);
    }

    // Admin: list notifications for a residence (JSON).
    public function adminIndex($residenceId)
    {
        if (! $this->userIsAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $notifications = Notification::where('residence_id', $residenceId)
            ->with('sender')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Admin: create a notification for a residence.
     * Accepts POST to /admin/residences/{residenceId}/notifications
     */
    public function store(Request $request, $residenceId = null)
    {
        if (! $this->userIsAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'type' => 'required|string|in:announcement,technical,reminder,maintenance',
            'content' => 'required|string|max:1000',
            'residence_id' => 'nullable|exists:residences,id',
        ]);

        // resolve residence id: route param > request body > admin user's residence
        $resolvedResidenceId = $residenceId ?? $data['residence_id'] ?? $request->user()->residence_id ?? null;

        if (! $resolvedResidenceId) {
            return response()->json(['message' => 'The residence field is required.'], 422);
        }

        $notification = Notification::create([
            'type' => $data['type'],
            'content' => $data['content'],
            'residence_id' => $resolvedResidenceId,
            'user_id' => $request->user()->id,
            'is_read' => false, // ensure unread when created
        ]);

        $notification->load('sender');

        // broadcast creation
        event(new NotificationCreated($notification));

        return response()->json(['notification' => $notification->load('sender')], 201);
    }

    /**
     * Create a simple "login" notification for the current user's residence.
     * Front-end used: POST '/api/notifications/login' (ensure route exists)
     */
    public function loginNotification(Request $request)
    {
        $user = $request->user();
        if (! $user || ! $user->residence_id) {
            return response()->json(['message' => 'No residence found for user'], 422);
        }

        $notification = Notification::create([
            'type' => 'announcement',
            'content' => "{$user->first_name} logged in", // adjust as needed
            'sender_id' => $user->id,
            'residence_id' => $user->residence_id,
            'is_read' => false,
        ]);

        return response()->json(['notification' => $notification], 201);
    }

    /**
     * Admin: update a notification (content/type).
     */
    public function update(Request $request, Notification $notification)
    {
        if (! $this->userIsAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'type' => 'sometimes|string|in:announcement,technical,reminder,maintenance',
            'content' => 'sometimes|string|max:1000',
            'is_read' => 'sometimes|boolean',
        ]);

        $notification->update($data);
        $notification->load('sender');

        // broadcast update
        event(new NotificationUpdated($notification));

        return response()->json([
            'message' => 'Notification updated',
            'notification' => $notification
        ]);
    }

    /**
     * Admin: delete a notification.
     */
    public function destroy(Notification $notification)
    {
        if (! $this->userIsAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        // capture data for broadcast after delete
        $notification->load('sender');

        $notification->delete();

        // broadcast deletion (sends id & residence in event)
        event(new NotificationDeleted($notification));

        return response()->json(['message' => 'Notification deleted']);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);
        $notification->load('sender');

        // optional: broadcast update so clients refresh unread count / UI
        event(new NotificationUpdated($notification));

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Get recent unread notifications for current user.
     */
    public function recent(Request $request)
    {
        $user = $request->user() ?? auth()->user();
        $residenceId = $user->residence_id ?? session('selected_residence_id') ?? null;

        if (! $residenceId) {
            return response()->json(['notifications' => []]);
        }

        $notifications = \App\Models\Notification::where('residence_id', $residenceId)
            ->with('sender')
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Clear all notifications for current residence (mark as read).
     */
    public function clearAll()
    {
        $user = auth()->user();
        if (!$user || !$user->residence_id) {
            return response()->json(['message' => 'No residence selected']);
        }

        Notification::where('residence_id', $user->residence_id)
            ->update(['is_read' => true]);

        return response()->json(['message' => 'All notifications marked as read']);
    }
}