<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Message;
use App\Models\Chatroom;
use Inertia\Inertia;

class MessageController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get all groups with their relationships
        $groups = Group::with([
            'chatroom',
            'chatroom.messages' => function($query) {
                $query->with('sender:id,name')
                      ->orderBy('created_at', 'desc')
                      ->take(1);
            },
            'members.user:id,name'  // Get members through the GroupMember pivot model
        ])
        ->get()
        ->filter(function($group) use ($user) {
            // Filter groups where the user is a member
            return $group->members->contains('user_id', $user->id);
        })
        ->map(function($group) use ($user) {
            $lastMessage = $group->chatroom && $group->chatroom->messages->first()
                ? $group->chatroom->messages->first()
                : null;

            return [
                'id' => $group->id,
                'name' => $group->name,
                'description' => $group->description,
                'chatroom_id' => $group->chatroom ? $group->chatroom->id : null,
                'members' => $group->members->count(),
                'lastMessage' => $lastMessage ? $lastMessage->message : 'No messages yet',
                'lastMessageTime' => $lastMessage ? $lastMessage->created_at->format('H:i') : '',
                'unreadCount' => 0, // TODO: Implement unread count based on read_at
            ];
        })
        ->values(); // Reset array keys

        return inertia('Student_Dashboard/Messages', [
            'groups' => $groups,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
            ]
        ]);
    }

    // Get messages for a specific chatroom
    public function getChatroomMessages($chatroomId)
    {
        $messages = Message::where('chatroom_id', $chatroomId)
            ->with('sender:id,name')
            ->orderBy('created_at', 'asc')
            ->get()
            ->map(function($message) {
                return [
                    'id' => $message->id,
                    'sender_id' => $message->sender_id,
                    'sender' => $message->sender->name,
                    'message' => $message->message,
                    'timestamp' => $message->created_at->toISOString(),
                    'isOwn' => $message->sender_id === auth()->id(),
                ];
            });

        return response()->json($messages);
    }

    // Store a newly created message
    public function store(Request $request)
    {
        $validated = $request->validate([
            'chatroom_id' => 'required|exists:chatroom,id',
            'message' => 'required|string|max:5000',
        ]);

        $message = Message::create([
            'sender_id' => auth()->id(),
            'chatroom_id' => $validated['chatroom_id'],
            'message' => $validated['message'],
            'receiver_id' => null, // Group message
        ]);

        $message->load('sender:id,name');

        return response()->json([
            'id' => $message->id,
            'sender_id' => $message->sender_id,
            'sender' => $message->sender->name,
            'message' => $message->message,
            'timestamp' => $message->created_at->toISOString(),
            'isOwn' => true,
        ], 201);
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
