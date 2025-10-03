<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $groups = Group::with('messages')->get();

        return inertia('Student_Dashboard/Messages', ['groups' => $groups]);
    }

    // Store a newly created message
    public function store(Request $request)
    {
        $message = Message::create($request->all());
        return response()->json($message, 201);
    }

    // Show a specific message
    public function show($id)
    {
        return Message::findOrFail($id);
    }

    // Update a message
    public function update(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $message->update($request->all());
        return response()->json($message);
    }

    // Delete a message
    public function destroy($id)
    {
        Message::destroy($id);
        return response()->json(null, 204);
    }
}
