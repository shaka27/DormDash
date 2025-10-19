<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    protected function userIsAdmin()
    {
        $user = Auth::user();
        if (! $user) return false;
        return $user->roles->pluck('description')->contains('Admin');
    }

    /**
     * Student view: show notifications for the user's residence.
     */
    public function index()
    {
        $user = auth()->user();

        // Get notifications for the user's residence
        $notifications = Notification::where('residence_id', $user->residence_id)
            ->with('sender')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
            'user' => $user,
        ]);
    }

    /**
     * Admin: list notifications for a residence (JSON).
     */
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
     * Show a single notification with full details.
     */
    public function show(Notification $notification)
    {
        $user = auth()->user();
        
        // Check if user has access to this notification
        if ($notification->residence_id !== $user->residence_id) {
            abort(403, 'Unauthorized');
        }

        // Mark as read if not already
        if (!$notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        return Inertia::render('Student_Dashboard/NotificationDetails', [
            'notification' => $notification->load('sender'),
        ]);
    }

    /**
     * Admin: create a notification for a residence.
     */
    public function store(Request $request)
    {
        if (! $this->userIsAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $request->validate([
            'type' => 'required|string|in:announcement,technical,reminder,maintenance',
            'content' => 'required|string|max:1000',
            'residence_id' => 'required|exists:residences,id',
        ]);

        $notification = Notification::create([
            'type' => $request->type,
            'content' => $request->content,
            'user_id' => auth()->id(),
            'residence_id' => $request->residence_id,
            'is_read' => false,
        ]);

        return response()->json([
            'message' => 'Notification created',
            'notification' => $notification->load('sender')
        ], 201);
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

        $notification->delete();

        return response()->json(['message' => 'Notification deleted']);
    }

    /**
     * Mark a notification as read.
     */
    public function markAsRead(Notification $notification)
    {
        $notification->update(['is_read' => true]);

        return response()->json(['message' => 'Notification marked as read']);
    }

    /**
     * Get unread notification count for current user.
     */
    public function count()
    {
        $user = auth()->user();
        if (!$user || !$user->residence_id) {
            return response()->json(['count' => 0]);
        }

        $count = Notification::where('residence_id', $user->residence_id)
            ->where('is_read', false)
            ->count();

        return response()->json(['count' => $count]);
    }

    /**
     * Get recent unread notifications for current user.
     */
    public function recent()
    {
        $user = auth()->user();
        if (!$user || !$user->residence_id) {
            return response()->json(['notifications' => []]);
        }

        $notifications = Notification::where('residence_id', $user->residence_id)
            ->where('is_read', false)
            ->with('sender')
            ->orderByDesc('created_at')
            ->take(5)
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Clear all notifications for current user.
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