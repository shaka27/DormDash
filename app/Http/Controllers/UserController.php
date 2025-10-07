<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Access;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class UserController extends Controller
{
    /* =======================
     * USER CRUD
     * ======================= */

    // List all users
    public function index()
    {
        // Include roles relationship
        $users = User::with('roles')->get();
        return response()->json($users);
    }

    // Show registration form
    public function create()
    {
        return inertia('auth/New_Register');
    }

    // Create a new user (registration)
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'            => 'required|string|max:255',
            'last_name'             => 'required|string|max:255',
            'email'                 => 'required|string|email|max:255|unique:users',
            'contact_num'           => 'required|string|max:20',
            'gender'                => 'required|string|in:male,female,other,prefer_not_to_say',
            'student_number'        => 'required|string|max:255',
            'password'              => 'required|string|min:8|confirmed',
        ]);

        // Check if student_number exists in access table
        $access = Access::where('student_number', $validated['student_number'])->first();

        if (!$access) {
            throw ValidationException::withMessages([
                'student_number' => 'This student number is not authorized to register.',
            ]);
        }

        // Check if student number is already registered
        $existingUser = User::where('student_number', $validated['student_number'])->first();
        if ($existingUser) {
            throw ValidationException::withMessages([
                'student_number' => 'This student number has already been registered.',
            ]);
        }

        // Create user with residence from access table
        $user = User::create([
            'first_name'      => $validated['first_name'],
            'last_name'       => $validated['last_name'],
            'email'           => $validated['email'],
            'contact_num'     => $validated['contact_num'],
            'gender'          => $validated['gender'],
            'student_number'  => $validated['student_number'],
            'password'        => Hash::make($validated['password']),
            'residence_id'    => $access->residence_id,
        ]);

        $role = Role::where('description', $access->role)->first();
        if ($role) {
            $user->roles()->attach($role->id);
        }

        // Log the user in
        Auth::login($user);
        $request->session()->regenerate();

        return redirect('/StudentDashboard');
    }

    // Show a specific user
    public function show($id)
    {
        $user = User::with('roles')->findOrFail($id);
        return response()->json($user);
    }

    // Show edit form
    public function edit($id)
    {
        $user = User::with('roles')->findOrFail($id);
        $roles = Role::all();
        
        return Inertia::render('Student_Dashboard/EditUser', [
            'user' => $user,
            'roles' => $roles
        ]);
    }

    // Update a user
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'first_name'    => 'sometimes|required|string|max:255',
            'last_name'     => 'sometimes|required|string|max:255',
            'contact_num'   => 'sometimes|required|string|max:20',
            'gender'        => 'sometimes|required|string|in:male,female,other,prefer_not_to_say',
            'password'      => 'sometimes|nullable|string|min:8',
            'role_id'       => 'sometimes|required|exists:roles,id',
        ]);

        // Update basic fields
        if (isset($validated['first_name'])) {
            $user->first_name = $validated['first_name'];
        }
        if (isset($validated['last_name'])) {
            $user->last_name = $validated['last_name'];
        }
        if (isset($validated['contact_num'])) {
            $user->contact_num = $validated['contact_num'];
        }
        if (isset($validated['gender'])) {
            $user->gender = $validated['gender'];
        }

        // Update password if provided
        if (isset($validated['password']) && !empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        // Update role if provided
        if (isset($validated['role_id'])) {
            $user->roles()->sync([$validated['role_id']]);
        }

        return redirect()->route('user-management.index')
            ->with('success', 'User updated successfully');
    }

    // Delete a user
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }

    // Count students
    public function count()
    {
        // Count all users who have the 'Student' or 'HouseCommittee' role
        $studentCount = User::whereHas('roles', function ($query) {
            $query->whereIn('description', ['Student', 'HouseCommittee']);
        })->count();

        return response()->json(['count' => $studentCount]);
    }
}