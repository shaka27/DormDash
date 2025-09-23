<?php

namespace App\Http\Controllers;

use App\Models\Residence;
use App\Models\User;
use Illuminate\Http\Request;

class ResidenceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $residences = Residence::all();
        return response()->json($residences);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'campus_id' => 'nullable|integer',
            'role_id' => 'nullable|integer',
        ]);

        $residence = Residence::create($request->all());

        return response()->json([
            'message' => 'Residence created successfully',
            'residence' => $residence,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $residence = Residence::findOrFail($id);
        return response()->json($residence);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $residence = Residence::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'campus_id' => 'nullable|integer',
            'role_id' => 'nullable|integer',
        ]);

        $residence->update($request->all());

        return response()->json([
            'message' => 'Residence updated successfully',
            'residence' => $residence,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $residence = Residence::findOrFail($id);
        $residence->delete();

        return response()->json(['message' => 'Residence deleted successfully']);
    }

    /**
     * Assign a user to a residence.
     */
    public function assignUser(Request $request, $residenceId)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::findOrFail($request->user_id);
        $residence = Residence::findOrFail($residenceId);

        $user->residence_id = $residence->id;
        $user->save();

        return response()->json([
            'message' => 'User assigned to residence successfully',
            'user' => $user,
        ]);
    }

    /**
     * Remove a user from a residence.
     */
    public function removeUser($residenceId, $userId)
    {
        $user = User::where('id', $userId)->where('residence_id', $residenceId)->firstOrFail();

        $user->residence_id = null;
        $user->save();

        return response()->json([
            'message' => 'User removed from residence successfully',
            'user' => $user,
        ]);
    }
}
