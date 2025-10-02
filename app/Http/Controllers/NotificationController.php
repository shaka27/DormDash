<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;
use App\Models\Residence;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificationController extends Controller
{
    /**
     * Check if user can manage notifications (Admin, HouseParent, or HouseCommittee).
     */
    private function canManageNotifications()
    {
        $user = Auth::user();
        $userRoles = $user->roles->pluck('description')->toArray();

        return in_array('Admin', $userRoles) ||
               in_array('HouseParent', $userRoles) ||
               in_array('HouseCommittee', $userRoles);
    }

    /**
     * List all notifications for the authenticated user.
     */
    public function index(Request $request)
    {
        $user = Auth::user();

        // Get residence ID from session (for admins) or user's residence_id (for students)
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        // Get notifications where the user is the recipient and matches the current residence context
        $notifications = Notification::with(['sender', 'residence'])
            ->where('recipient_id', $user->id)
            ->when($residenceId, function ($query) use ($residenceId) {
                return $query->where('residence_id', $residenceId);
            })
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => $notification->type,
                    'content' => $notification->content,
                    'is_read' => (bool) $notification->is_read,
                    'created_at' => $notification->created_at->format('Y-m-d H:i:s'),
                    'sender' => [
                        'id' => $notification->sender->id,
                        'name' => $notification->sender->name,
                    ],
                    'residence_id' => $notification->residence_id,
                ];
            });

        return Inertia::render('Student_Dashboard/Notifications', [
            'notifications' => $notifications,
            'canManage' => $this->canManageNotifications(),
            'user' => $user,
        ]);
    }

    /**
     * Create a notification.
     * Always broadcasts to all users in the authenticated user's residence.
     * Only accessible to Admin, HouseParent, and HouseCommittee.
     */
    public function store(Request $request)
    {
        if (!$this->canManageNotifications()) {
            // For web routes (Inertia), redirect back with error
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized. Only Admin, HouseParent, and HouseCommittee can create notifications.'], 403);
            }
            return back()->withErrors(['error' => 'Unauthorized. Only Admin, HouseParent, and HouseCommittee can create notifications.']);
        }

        $request->validate([
            'type' => 'required|string|max:255',
            'content' => 'required|string',
        ]);

        $user = Auth::user();

        // Get residence ID from session (for admins) or user's residence_id (for students)
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        if (!$residenceId) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'No residence selected. Please select a residence first.'], 422);
            }
            return back()->withErrors(['error' => 'No residence selected. Please select a residence first.']);
        }

        // Broadcast to all users in the residence
        $residence = Residence::with('users')->findOrFail($residenceId);
        $notificationCount = 0;


        foreach ($residence->users as $recipient) {
            Notification::create([
                'type' => $request->type,
                'content' => $request->content,
                'is_read' => false,
                'user_id' => $user->id,
                'recipient_id' => $recipient->id,
                'residence_id' => $residence->id,
            ]);
            $notificationCount++;
        }

        // For web routes (Inertia), redirect back with success message
        if ($request->wantsJson()) {
            return response()->json([
                'message' => 'Notification broadcasted to all users in residence',
                'count' => $notificationCount,
            ], 201);
        }

        return back()->with('success', "Notification broadcasted to {$notificationCount} users in residence");
    }

    /**
     * Show a single notification.
     */
    public function show($id)
    {
        $user = Auth::user();
        $notification = Notification::with(['sender', 'recipient', 'residence'])->findOrFail($id);

        // Only allow viewing if user is the recipient or can manage notifications
        if ($notification->recipient_id !== $user->id && !$this->canManageNotifications()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        return response()->json($notification);
    }

    /**
     * Update a notification (mark as read or edit content).
     * Students can only mark as read. Managers can edit content.
     */
    public function update(Request $request, $id)
    {
        $user = Auth::user();
        $notification = Notification::findOrFail($id);

        // Check authorization
        $isRecipient = $notification->recipient_id === $user->id;
        $canManage = $this->canManageNotifications();

        if (!$isRecipient && !$canManage) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Students can only mark as read
        if ($isRecipient && !$canManage) {
            $request->validate([
                'is_read' => 'required|boolean',
            ]);

            $notification->update(['is_read' => $request->is_read]);
        }
        // Managers can edit everything
        else if ($canManage) {
            $request->validate([
                'type' => 'sometimes|string|max:255',
                'content' => 'sometimes|string',
                'is_read' => 'sometimes|boolean',
            ]);

            $notification->update($request->only(['type', 'content', 'is_read']));
        }

        return redirect()->back()->with([
            'message' => 'Notification updated successfully',
            'notification' => $notification->fresh(),
        ]);
    }

    /**
     * Delete a notification.
     * Only accessible to Admin, HouseParent, and HouseCommittee.
     */
    public function destroy($id)
    {
        if (!$this->canManageNotifications()) {
            return response()->json(['error' => 'Unauthorized. Only Admin, HouseParent, and HouseCommittee can delete notifications.'], 403);
        }

        $notification = Notification::findOrFail($id);
        $notification->delete();

        return redirect()->back()->with([
            'message' => 'Notification deleted successfully',
        ]);
    }
}
