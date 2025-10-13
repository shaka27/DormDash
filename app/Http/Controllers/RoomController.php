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
                ->with(['residence', 'users'])
                ->first();
        }

        return Inertia::render('Student_Dashboard/RoomIndex', [
            'room' => $room,
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

        return Inertia::render('Student_Dashboard/RoomDetails', [
            'room' => $room->load('residence', 'users')
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
