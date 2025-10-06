<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Access;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    /* =======================
     * USER CRUD
     * ======================= */

    // List all users
    public function index()
    {
        return response()->json(User::all());
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
            'contact_num'        => 'required|string|max:20',
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
            'contact_num'  => $validated['contact_num'],
            'gender'          => $validated['gender'],
            'student_number'  => $validated['student_number'],
            'password'        => Hash::make($validated['password']),
            'residence_id'    => $access->residence_id,
        ]);

        $role = \App\Models\Role::where('description', $access->role)->first();
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
        return response()->json(User::findOrFail($id));
    }

    // Update a user (but never email!)
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name'     => 'sometimes|required|string|max:255',
            'password' => 'sometimes|required|string|min:8',
            // email is NOT updatable
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // Delete a user
    public function destroy($id)
    {
        User::findOrFail($id)->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}