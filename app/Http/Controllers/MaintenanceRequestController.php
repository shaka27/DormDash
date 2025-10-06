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
        $requests = Auth::user()->maintenanceRequests()
            ->with('room')
            ->latest('reported_at')
            ->get();

        return Inertia::render('Student_Dashboard/MaintenanceRequests', [
            'requests' => $requests
        ]);
    }

    public function create()
    {
        return Inertia::render('Student_Dashboard/CreateMaintenanceRequest');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'issue' => 'required|string|max:255',
            'description' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        Auth::user()->maintenanceRequests()->create([
            'issue' => $validated['issue'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'room_id' => Auth::user()->room_id,
            'status' => 'pending',
        ]);

        return redirect()->route('maintenance.index')->with('success', 'Maintenance request submitted successfully.');
    }
}
