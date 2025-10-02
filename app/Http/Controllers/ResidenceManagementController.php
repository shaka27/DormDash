<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Residence;
use App\Models\User;
use App\Models\Access;
use App\Models\Role;
use Inertia\Inertia;
use PhpOffice\PhpSpreadsheet\IOFactory;

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

    public function importAccess(Request $request)
    {
        $user = auth()->user();

        // Get residence ID from session (for admins) or user's residence_id (for students)
        $residenceId = $request->session()->get('selected_residence_id', $user->residence_id);

        $request->validate([
            'file' => 'required|file|mimes:xlsx,xls',
        ]);

        $file = $request->file('file');
        $spreadsheet = IOFactory::load($file->getRealPath());
        $worksheet = $spreadsheet->getActiveSheet();

        // Get all valid role descriptions
        $validRoles = Role::pluck('description')->toArray();

        $addedCount = 0;
        $invalidEntries = [];
        $rowNumber = 2; // Start from row 2 (row 1 is headers)

        foreach ($worksheet->getRowIterator(2) as $row) {
            $cellIterator = $row->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false);

            $rowData = [];
            foreach ($cellIterator as $cell) {
                $rowData[] = $cell->getValue();
            }

            // Skip if both columns are empty
            if (empty($rowData[0]) && empty($rowData[1])) {
                $rowNumber++;
                continue;
            }

            $studentNumber = trim($rowData[0] ?? '');
            $role = trim($rowData[1] ?? '');

            // Validate the entry
            $errors = [];

            if (empty($studentNumber)) {
                $errors[] = 'Missing student number';
            }

            if (empty($role)) {
                $errors[] = 'Missing role';
            } elseif (!in_array($role, $validRoles)) {
                $errors[] = 'Invalid role';
            }

            // Check if student number already exists in access table
            if (!empty($studentNumber) && Access::where('student_number', $studentNumber)->exists()) {
                $errors[] = 'Student number already exists';
            }

            // If there are errors, add to invalid entries
            if (!empty($errors)) {
                $invalidEntries[] = [
                    'row' => $rowNumber,
                    'student_number' => $studentNumber ?: 'N/A',
                    'role' => $role ?: 'N/A',
                    'errors' => implode(', ', $errors),
                ];
            } else {
                // Add the access entry
                Access::create([
                    'student_number' => $studentNumber,
                    'residence_id' => $residenceId,
                    'role' => $role,
                ]);
                $addedCount++;
            }

            $rowNumber++;
        }

        return redirect()->back()->with('importResults', [
            'added' => $addedCount,
            'invalid' => $invalidEntries,
        ]);
    }
}
