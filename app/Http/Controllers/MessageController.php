<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Message;
use App\Models\Chatroom;
use App\Models\User;
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
                $query->with('sender:id,first_name,last_name')
                      ->orderBy('created_at', 'desc')
                      ->take(1);
            },
            'members.user:id,first_name,last_name'  // Get members through the GroupMember pivot model
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

        // Get direct message conversations (users the current user has messaged with)
        $directMessageConversations = Message::where(function($query) use ($user) {
            $query->where('sender_id', $user->id)
                  ->orWhere('receiver_id', $user->id);
        })
        ->whereNull('chatroom_id')
        ->with(['sender:id,first_name,last_name', 'receiver:id,first_name,last_name'])
        ->get()
        ->groupBy(function($message) use ($user) {
            // Group by the other user's ID
            return $message->sender_id === $user->id ? $message->receiver_id : $message->sender_id;
        })
        ->map(function($messages, $otherUserId) use ($user) {
            $lastMessage = $messages->sortByDesc('created_at')->first();
            $otherUser = $lastMessage->sender_id === $user->id ? $lastMessage->receiver : $lastMessage->sender;

            return [
                'id' => $otherUser->id,
                'name' => $otherUser->name,
                'email' => $otherUser->email,
                'lastMessage' => $lastMessage->message,
                'lastMessageTime' => $lastMessage->created_at->format('H:i'),
                'unreadCount' => 0, // TODO: Implement unread count
            ];
        })
        ->sortByDesc('lastMessageTime')
        ->values();

        // Get all users in the same residence (for new messages)
        $residenceUsers = User::where('residence_id', $user->residence_id)
            ->where('id', '!=', $user->id)
            ->select('id', 'first_name', 'last_name', 'email')
            ->orderBy('first_name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name, // Uses the name accessor
                    'email' => $user->email,
                ];
            });

        return inertia('Student_Dashboard/Messages', [
            'groups' => $groups,
            'directMessages' => $directMessageConversations,
            'residenceUsers' => $residenceUsers,
            'canManageGroups' => $user->canManageGroups(),
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
            ->with('sender:id,first_name,last_name')
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

    // Get users in the same residence for direct messaging
    public function getResidenceUsers()
    {
        $user = auth()->user();

        $users = User::where('residence_id', $user->residence_id)
            ->where('id', '!=', $user->id)
            ->select('id', 'first_name', 'last_name', 'email')
            ->orderBy('first_name')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name, // Uses the name accessor
                    'email' => $user->email,
                ];
            });

        return response()->json($users);
    }

    // Get direct messages with a specific user
    public function getDirectMessages($userId)
    {
        $currentUserId = auth()->id();

        $messages = Message::where(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })
        ->orWhere(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })
        ->whereNull('chatroom_id')
        ->with('sender:id,first_name,last_name')
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

    // Store a newly created message (for web routes - Inertia)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'chatroom_id' => 'nullable|exists:chatroom,id',
            'receiver_id' => 'nullable|exists:users,id',
            'message' => 'required|string|max:5000',
        ]);

        $chatroomId = $validated['chatroom_id'] ?? null;
        $receiverId = $validated['receiver_id'] ?? null;

        // Ensure either chatroom_id or receiver_id is provided, but not both
        if ((!$chatroomId && !$receiverId) || ($chatroomId && $receiverId)) {
            return back()->withErrors([
                'message' => 'Message must be either a group message or a direct message, not both.'
            ]);
        }

        $message = Message::create([
            'sender_id' => auth()->id(),
            'chatroom_id' => $chatroomId,
            'receiver_id' => $receiverId,
            'message' => $validated['message'],
        ]);

        return back();
    }

    // Show messages for a specific chatroom (for web routes - Inertia)
    public function showChatroom($chatroomId)
    {
        $user = auth()->user();

        // Verify user has access to this chatroom
        $chatroom = Chatroom::findOrFail($chatroomId);

        $messages = Message::where('chatroom_id', $chatroomId)
            ->with('sender:id,first_name,last_name')
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

    // Show direct messages with a specific user (for web routes - Inertia)
    public function showDirectMessages($userId)
    {
        $currentUserId = auth()->id();

        $messages = Message::where(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $currentUserId)
                  ->where('receiver_id', $userId);
        })
        ->orWhere(function($query) use ($currentUserId, $userId) {
            $query->where('sender_id', $userId)
                  ->where('receiver_id', $currentUserId);
        })
        ->whereNull('chatroom_id')
        ->with('sender:id,first_name,last_name')
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
