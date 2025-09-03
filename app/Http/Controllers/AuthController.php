<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Handle user login
     */
    public function login(Request $request)
    {
        //  Validate login data
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Attempt to find user and check password
        $user = User::where('email', $request->email)->first();

        // Check if user exists and password is correct
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        //  Delete any existing tokens (optional, for security)
        $user->tokens()->delete();

        //  Create new API token
        $token = $user->createToken('web-token')->plainTextToken;

        // Check user roles
        //$isAdmin = $user->roles->contains('name', 'admin');
        $isAdmin = false; // Temporary fix - roles table doesn't exist

        //  Return response with user data and token
        return response()->json([
            'message' => 'Login successful!',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'is_admin' => $isAdmin,
            ],
            'token' => $token
        ], 200);
    }

    /**
     * Handle user logout
     */
    public function logout(Request $request)
    {
        // Delete current access token
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully!']);
    }

    /**
     * Get current authenticated user data
     */
    public function user(Request $request)
    {
        $user = $request->user();
        //$isAdmin = $user->roles->contains('name', 'admin');
        $isAdmin = false;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'is_admin' => $isAdmin,
            ]
        ]);
    }
}