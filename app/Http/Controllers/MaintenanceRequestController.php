<?php

namespace App\Http\Controllers;

use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class MaintenanceRequestController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        
        // If user is admin, redirect to admin index
        if ($user->role === 'admin' || $user->role === 'house_parent' || $user->role === 'house_committee') {
            return $this->adminIndex();
        }

        // For students, show only their requests
        $requests = $user->maintenanceRequests()
            ->with('room.residence')
            ->latest('reported_at')
            ->get();

        return Inertia::render('Maintenance/page', [
            'requests' => $requests,
            'userRole' => $user->role
        ]);
    }

    public function adminIndex()
    {
        $requests = MaintenanceRequest::with(['user', 'room.residence'])
            ->latest('reported_at')
            ->get();

        return Inertia::render('Maintenance/page', [
            'requests' => $requests,
            'userRole' => 'admin'
        ]);
    }

    public function create()
    {
        return Inertia::render('Maintenance/CreateMaintenanceRequest');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'issue' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        $user = Auth::user();

        $user->maintenanceRequests()->create([
            'issue' => $validated['issue'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'room_id' => $user->room_id,
            'status' => 'pending',
            'reported_at' => now(),
        ]);

        return redirect()->route('maintenance.index')->with('success', 'Maintenance request submitted successfully.');
    }

    public function update(Request $request, MaintenanceRequest $maintenanceRequest)
    {
        $validated = $request->validate([
            'status' => 'required|in:pending,in-progress,completed',
            'staff_notes' => 'nullable|string',
            'assigned_staff' => 'nullable|string',
        ]);

        $updateData = [
            'status' => $validated['status'],
            'staff_notes' => $validated['staff_notes'] ?? null,
        ];

        if ($validated['status'] === 'completed') {
            $updateData['completed_at'] = now();
        }

        if (isset($validated['assigned_staff'])) {
            $updateData['assigned_staff'] = $validated['assigned_staff'];
        }

        $maintenanceRequest->update($updateData);

        return redirect()->back()->with('success', 'Maintenance request updated successfully.');
    }
}
