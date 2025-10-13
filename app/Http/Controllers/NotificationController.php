<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    protected function userIsAdmin()
    {
        $user = Auth::user();
        if (! $user) return false;
        // adjust to your role implementation; this checks Role.description == 'Admin'
        return $user->roles->pluck('description')->contains('Admin');
    }

    /**
     * Student view: show notifications for the user's residence.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $residenceId = $user->residence_id ?? session('selected_residence_id') ?? null;

        $notifications = collect();
        if ($residenceId) {
            $notifications = Notification::where('residence_id', $residenceId)
                ->orderByDesc('created_at')
                ->get();
        }

        // pass canManage flag for UI (admins who have selected a residence)
        $canManage = $this->userIsAdmin() && ($user->residence_id || session('selected_residence_id'));

        return Inertia::render('Student_Dashboard/Notifications', [
            'notifications' => $notifications,
            'user' => $user,
            'canManage' => $canManage,
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
            ->orderByDesc('created_at')
            ->get();

        return response()->json(['notifications' => $notifications]);
    }

    /**
     * Admin: create a notification for a residence.
     */
    public function store(Request $request, $residenceId)
    {
        if (! $this->userIsAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'type' => 'required|string|max:64',
            'content' => 'required|string',
        ]);

        $notification = Notification::create([
            'type' => $data['type'],
            'content' => $data['content'],
            'residence_id' => (int) $residenceId,
            'sender_id' => $request->user()->id,
        ]);

        // return created notification
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
            'type' => 'sometimes|string|max:64',
            'content' => 'sometimes|string',
        ]);

        $notification->update($data);

        return response()->json(['notification' => $notification]);
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

        return response()->json(['message' => 'Deleted']);
    }
}
