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
    public function index()
    {
        $user = auth()->user();

        $notifications = Notification::where(function ($q) use ($user) {
                $q->where('residence_id', $user->residence_id);
            })
            ->with('sender')
            ->orderByDesc('created_at')
            ->get();

        return Inertia::render('Notifications', [
            'notifications' => $notifications,
            'user' => $user,
            'canManage' => $user->can('manage notifications'), // or whatever permission you use
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
    public function store(Request $request)
{
    $request->validate([
        'type' => 'required|string',
        'content' => 'required|string',
        'residence_id' => 'required|exists:residences,id',
    ]);

    $notification = Notification::create([
        'type' => $request->type,
        'content' => $request->content,
        'sender_id' => auth()->id(),
        'residence_id' => $request->residence_id,
    ]);

    // Get all students in the residence
    $students = User::whereHas('roles', fn($q) => $q->where('description', 'Student'))
        ->where('residence_id', $request->residence_id)
        ->get();

    // Attach notification to each student
    foreach ($students as $student) {
        $student->notifications()->attach($notification->id, ['is_read' => false]);
    }

    return back()->with('success', 'Notification broadcast to residence');
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

    public function clearAll()
    {
        $user = auth()->user();

        // Assuming a many-to-many pivot between users and notifications
        $user->notifications()->detach();

        return back()->with('success', 'All notifications cleared');
    }

    public function count()
    {
        $user = auth()->user();
        $count = $user->notifications()->whereNull('read_at')->count();
        return response()->json(['count' => $count]);
    }

    public function recent()
    {
        $user = auth()->user();
        $notifications = $user->notifications()->latest()->take(5)->get();
        return response()->json(['notifications' => $notifications]);
    }

}
