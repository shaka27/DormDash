<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Group;
use App\Models\Chatroom;
use App\Models\GroupMember;
use App\Models\GroupRole;

class GroupController extends Controller
{
    public function store(Request $request)
    {
        // Check if user has permission
        if (!auth()->user()->canManageGroups()) {
            return back()->withErrors([
                'error' => 'You do not have permission to create groups.'
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'member_ids' => 'required|array|min:1',
            'member_ids.*' => 'exists:users,id',
        ]);

        // Create the group
        $group = Group::create([
            'name' => $validated['name'],
            'description' => $validated['description'] ?? '',
        ]);

        // Create a chatroom for the group
        Chatroom::create([
            'name' => $validated['name'] . ' Chat',
            'description' => $validated['description'] ?? '',
            'group_id' => $group->id,
            'residence_id' => auth()->user()->residence_id,
        ]);

        // Get or create the default "Member" group role
        $memberRole = GroupRole::firstOrCreate(
            ['name' => 'Member'],
            [
                'name' => 'Member',
                'description' => 'Regular group member'
            ]
        );

        // Add members to the group
        foreach ($validated['member_ids'] as $userId) {
            GroupMember::create([
                'group_id' => $group->id,
                'user_id' => $userId,
                'gr_id' => $memberRole->id,
            ]);
        }

        // Also add the creator to the group if not already included
        if (!in_array(auth()->id(), $validated['member_ids'])) {
            GroupMember::create([
                'group_id' => $group->id,
                'user_id' => auth()->id(),
                'gr_id' => $memberRole->id,
            ]);
        }

        return redirect()->route('messages.index')->with('success', 'Group created successfully!');
    }
}
