<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    /**
     * Fetch the room index page
     */
    public function index(Request $request)
    {
        // Keep original behavior for non-student/API contexts
        $rooms = Room::with('residence', 'users')->get();
        return Inertia::render('Student_Dashboard/RoomIndex', ['rooms' => $rooms]);
    }

    /**
     * Student-facing Rooms page: only the authenticated user's assigned room
     */
    public function studentIndex(Request $request)
    {
        $user = $request->user();

        // If the signed-in user has an assigned room, only show that room on the student dashboard.
        // Use the relationship to avoid any table/column naming mismatch.
        $room = null;
        if ($user) {
            $room = $user->room()
                ->with([
                    'residence.campus',
                    'users',
                    'maintenanceRequests' => function ($q) {
                        $q->orderBy('reported_at', 'desc');
                    },
                ])
                ->first();

            // Persist missing bed number and floor so UI never shows undefined/null
            $changed = false;
            if ($room) {
                if ($room->capacity !== 3 || $room->type !== 'Residence') {
                    $room->capacity = 3;
                    $room->type = 'Residence';
                    $changed = true;
                }
                if (is_null($room->floor)) {
                    $room->floor = random_int(1, 3);
                    $changed = true;
                }
                if ($changed) {
                    $room->save();
                }
            }
            if ($user && is_null($user->bed_number) && $room) {
                $user->bed_number = random_int(1, 3);
                $user->save();
            }
        }

        return Inertia::render('Student_Dashboard/RoomIndex', [
            'room' => $room,
            'bed_number' => $user?->bed_number,
        ]);
    }

    /**
     * Admin-facing Rooms page: list all rooms in the selected residence
     */
    public function adminIndex(Request $request)
    {
        $user = $request->user();

        // Ensure only admins can access
        $isAdmin = $user && $user->roles()->where('description', 'Admin')->exists();
        if (!$isAdmin) {
            abort(403, 'Unauthorized');
        }

        // Residence must be selected and stored in session
        $selectedResidenceId = $request->session()->get('selected_residence_id');
        if (!$selectedResidenceId) {
            // No fallbacks: require selection first
            abort(404, 'Residence not selected');
        }

        // Fetch rooms scoped to the selected residence
        $rooms = Room::with(['residence.campus', 'users'])
            ->where('residence_id', $selectedResidenceId)
            ->orderBy('floor')
            ->orderBy('number')
            ->get();

        $residence = \App\Models\Residence::with('campus')->findOrFail($selectedResidenceId);

        return Inertia::render('Admin/RoomsIndex', [
            'rooms' => $rooms,
            'residence' => $residence,
        ]);
    }

    /**
     * Fetch the room details page
     */
    public function getRoomDetailsPage(Request $request, Room $room)
    {
        $user = $request->user();

        // If the user has an assigned room, prevent access to other rooms' detail pages
        if ($user && $user->room_id && (int)$user->room_id !== (int)$room->id) {
            abort(403, 'You are not authorized to view this room.');
        }

        // Ensure persisted constraints
        $changed = false;
        if ($room->capacity !== 3 || $room->type !== 'Residence') {
            $room->capacity = 3;
            $room->type = 'Residence';
            $changed = true;
        }
        if (is_null($room->floor)) {
            $room->floor = random_int(1, 3);
            $changed = true;
        }
        if ($changed) {
            $room->save();
        }
        if ($user && is_null($user->bed_number)) {
            $user->bed_number = random_int(1, 3);
            $user->save();
        }

        $room->load(['residence.campus', 'users', 'maintenanceRequests' => function ($q) {
            $q->orderBy('reported_at', 'desc');
        }]);

        return Inertia::render('Student_Dashboard/RoomDetails', [
            'room' => $room,
            'bed_number' => $user?->bed_number,
        ]);
    }

    /**
     * Store a new room.
     */
    public function store(Request $request)
    {
        $request->validate([
            'number' => 'required|integer',
            'status' => 'required|string|max:255',
            'residence_id' => 'required|exists:residences,id',
        ]);

        $room = Room::create($request->all());

        return response()->json([
            'message' => 'Room created successfully',
            'room' => $room,
        ], 201);
    }

    /**
     * Show a single room.
     */
    public function show($id)
    {
        $room = Room::with('residence', 'users')->findOrFail($id);
        return response()->json($room);
    }

    /**
     * Update a room.
     */
    public function update(Request $request, $id)
    {
        $room = Room::findOrFail($id);

        $request->validate([
            'number' => 'sometimes|integer',
            'status' => 'sometimes|string|max:255',
            'residence_id' => 'sometimes|exists:residences,id',
        ]);

        $room->update($request->all());

        return response()->json([
            'message' => 'Room updated successfully',
            'room' => $room,
        ]);
    }

    /**
     * Delete a room.
     */
    public function destroy($id)
    {
        $room = Room::findOrFail($id);
        $room->delete();

        return response()->json(['message' => 'Room deleted successfully']);
    }

    /**
     * Assign a user to a room.
     */
    public function assignUser(Request $request, $roomId)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $room = Room::findOrFail($roomId);
        $user = User::findOrFail($request->user_id);

        $user->room_id = $room->id;
        $user->save();

        return response()->json([
            'message' => 'User assigned to room successfully',
            'user' => $user,
        ]);
    }

    /**
     * Remove a user from a room.
     */
    public function removeUser($roomId, $userId)
    {
        $user = User::where('id', $userId)->where('room_id', $roomId)->firstOrFail();

        $user->room_id = null;
        $user->save();

        return response()->json([
            'message' => 'User removed from room successfully',
            'user' => $user,
        ]);
    }
}
