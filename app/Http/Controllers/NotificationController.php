<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Models\Residence;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NotificationController extends Controller
{
    // TODO: Implement possible notification navigation (optional)

    /**
     * List all notifications.
     */
    public function index()
    {
       $notifications = Notification::orderBy('created_at', 'desc')->get();
       return Inertia::render('Student_Dashboard/Notifications', ['notifications' => $notifications]);
    }

    /**
     * Create a notification.
     * Supports sending to one user or all users in a residence.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type' => 'required|string|max:255',
            'content' => 'required|string',
            'user_id' => 'required|exists:users,id', // sender
            'recipient_id' => 'nullable|exists:users,id',
            'residence_id' => 'nullable|exists:residences,id',
        ]);

        // Case 1: Send to single recipient
        if ($request->filled('recipient_id')) {
            $notification = Notification::create([
                'type' => $request->type,
                'content' => $request->content,
                'is_read' => false,
                'user_id' => $request->user_id,
                'recipient_id' => $request->recipient_id,
                'residence_id' => null,
            ]);

            return response()->json([
                'message' => 'Notification sent to user successfully',
                'notification' => $notification,
            ], 201);
        }

        // Case 2: Broadcast to all users in a residence
        if ($request->filled('residence_id')) {
            $residence = Residence::with('users')->findOrFail($request->residence_id);
            $notifications = [];

            foreach ($residence->users as $user) {
                $notifications[] = Notification::create([
                    'type' => $request->type,
                    'content' => $request->content,
                    'is_read' => false,
                    'user_id' => $request->user_id,
                    'recipient_id' => $user->id,
                    'residence_id' => $residence->id,
                ]);
            }

            return response()->json([
                'message' => 'Notification broadcasted to all users in residence',
                'notifications' => $notifications,
            ], 201);
        }

        return response()->json(['error' => 'Either recipient_id or residence_id is required'], 422);
    }

    /**
     * Show a single notification.
     */
    public function show($id)
    {
        $notification = Notification::with(['sender', 'recipient', 'residence'])->findOrFail($id);
        return response()->json($notification);
    }

    /**
     * Update a notification (mark as read or edit content).
     */
    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $request->validate([
            'type' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'is_read' => 'sometimes|boolean',
        ]);

        $notification->update($request->all());

        return response()->json([
            'message' => 'Notification updated successfully',
            'notification' => $notification,
        ]);
    }

    /**
     * Delete a notification.
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully']);
    }
}
