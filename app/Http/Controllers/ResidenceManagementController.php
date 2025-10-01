<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Residence;
use App\Models\User;
use App\Models\Access;
use App\Models\Role;
use Inertia\Inertia;

class ResidenceManagementController extends Controller
{
    public function index(Request $request)
    {
        $user = auth()->user();

        // Get residence ID from session (for admins) or user's residence_id (for students)
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        // Get the residence
        $residence = Residence::with('campus')->findOrFail($residenceId);

        // Get all users in this residence with their roles
        $users = User::where('residence_id', $residenceId)
            ->with('roles')
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'student_number' => $user->student_number,
                    'name' => $user->name,
                    'email' => $user->email,
                    'roles' => $user->roles->pluck('description')->join(', '),
                    'created_at' => $user->created_at->format('Y-m-d'),
                ];
            });

        // Get all access entries for this residence
        $accessList = Access::where('residence_id', $residenceId)
            ->get()
            ->map(function ($access) {
                // Check if user has registered
                $user = User::where('student_number', $access->student_number)->first();

                return [
                    'id' => $access->id,
                    'student_number' => $access->student_number,
                    'role' => $access->role,
                    'has_registered' => $user ? true : false,
                    'created_at' => $access->created_at->format('Y-m-d'),
                ];
            });

        // Get all available roles
        $roles = Role::all();

        return Inertia::render('Student_Dashboard/ResidenceManagement', [
            'residence' => $residence,
            'users' => $users,
            'accessList' => $accessList,
            'roles' => $roles,
        ]);
    }

    public function addAccess(Request $request)
    {
        $user = auth()->user();

        // Get residence ID from session (for admins) or user's residence_id (for students)
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        $validated = $request->validate([
            'student_number' => 'required|string|unique:access,student_number',
            'role' => 'required|string',
        ]);

        Access::create([
            'student_number' => $validated['student_number'],
            'residence_id' => $residenceId,
            'role' => $validated['role'],
        ]);

        return redirect()->back()->with('success', 'Access granted successfully');
    }

    public function deleteAccess(Request $request, $id)
    {
        $user = auth()->user();

        // Get residence ID from session (for admins) or user's residence_id (for students)
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        $access = Access::where('id', $id)
            ->where('residence_id', $residenceId)
            ->firstOrFail();

        $access->delete();

        return redirect()->back()->with('success', 'Access removed successfully');
    }
}
