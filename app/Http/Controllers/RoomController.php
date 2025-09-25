<?php

namespace App\Http\Controllers;

use App\Models\Room;
use App\Models\User;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    /**
     * Fetch the room index page
     */
    public function index(Request $request)
    {
        $rooms = Room::with('residence', 'users')->get();
        return Inertia::render('Student_Dashboard/RoomIndex', ['rooms' => $rooms]);
    }

    /**
     * Fetch the room details page
     */
    public function getRoomDetailsPage(Request $request, Room $room)
    {
        return Inertia::render('Student_Dashboard/RoomDetails', ['room' => $room->load('residence', 'users')]);
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
