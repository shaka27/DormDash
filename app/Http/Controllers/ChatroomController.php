<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Chatroom;

class ChatroomController extends Controller
{
    // Display a listing of chatrooms
    public function index()
    {
        return Chatroom::all();
    }

    // Store a newly created chatroom
    public function store(Request $request)
    {
        $chatroom = Chatroom::create($request->all());
        return response()->json($chatroom, 201);
    }

    // Show a specific chatroom
    public function show($id)
    {
        return Chatroom::findOrFail($id);
    }

    // Update a chatroom
    public function update(Request $request, $id)
    {
        $chatroom = Chatroom::findOrFail($id);
        $chatroom->update($request->all());
        return response()->json($chatroom);
    }

    // Delete a chatroom
    public function destroy($id)
    {
        Chatroom::destroy($id);
        return response()->json(null, 204);
    }
}
