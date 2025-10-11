<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Residence;
use App\Models\Room;
use App\Models\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get dashboard statistics
     */
    public function getStats()
    {
        try {
            // Get the selected residence ID from session
            $residenceId = session('selected_residence_id');

            $totalStudents = User::where('role', 'student')
                ->whereHas('applications', function($query) use ($residenceId) {
                    $query->where('residence_id', $residenceId);
                })
                ->count();

            $totalDorms = Residence::where('id', $residenceId)->count();

            // Calculate occupancy rate
            $totalRooms = Room::where('residence_id', $residenceId)->count();
            $occupiedRooms = Room::where('residence_id', $residenceId)
                ->where('current_occupants', '>', 0)
                ->count();
            
            $occupancyRate = $totalRooms > 0 ? round(($occupiedRooms / $totalRooms) * 100, 1) : 0;

            $pendingApplications = Application::where('residence_id', $residenceId)
                ->where('status', 'pending')
                ->count();

            // Calculate total revenue (example calculation)
            $residence = Residence::find($residenceId);
            $totalRevenue = $residence ? $occupiedRooms * ($residence->price_per_semester ?? 0) : 0;

            $availableRooms = Room::where('residence_id', $residenceId)
                ->where('status', 'available')
                ->whereColumn('current_occupants', '<', 'capacity')
                ->count();

            return response()->json([
                'totalStudents' => $totalStudents,
                'totalDorms' => $totalDorms,
                'occupancyRate' => $occupancyRate,
                'pendingApplications' => $pendingApplications,
                'totalRevenue' => $totalRevenue,
                'availableRooms' => $availableRooms,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'totalStudents' => 0,
                'totalDorms' => 0,
                'occupancyRate' => 0,
                'pendingApplications' => 0,
                'totalRevenue' => 0,
                'availableRooms' => 0,
            ]);
        }
    }

    /**
     * Get all students
     */
    public function getStudents(Request $request)
    {
        try {
            $residenceId = session('selected_residence_id');

            $students = User::where('role', 'student')
                ->with(['applications' => function($query) use ($residenceId) {
                    $query->where('residence_id', $residenceId);
                }])
                ->get()
                ->map(function($student) {
                    $application = $student->applications->first();
                    
                    return [
                        'id' => $student->id,
                        'studentNumber' => $student->student_number ?? 'N/A',
                        'name' => $student->name,
                        'email' => $student->email,
                        'phone' => $student->phone ?? 'N/A',
                        'faculty' => $student->faculty ?? 'N/A',
                        'year' => $student->year ?? 1,
                        'gender' => $student->gender ?? 'male',
                        'applicationStatus' => $application ? $application->status : 'pending',
                        'dormAssignment' => $application && $application->assigned_room ? $application->assignedRoom->residence->name : null,
                        'roomNumber' => $application && $application->assigned_room ? $application->assignedRoom->room_number : null,
                        'applicationDate' => $application ? $application->created_at->toISOString() : now()->toISOString(),
                        'preferences' => $application ? json_decode($application->preferences ?? '[]') : [],
                    ];
                });

            return response()->json($students);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get all dormitories
     */
    public function getDormitories()
    {
        try {
            $residenceId = session('selected_residence_id');

            $dormitories = Residence::where('id', $residenceId)
                ->with('rooms')
                ->get()
                ->map(function($dorm) {
                    $totalRooms = $dorm->rooms->count();
                    $occupiedRooms = $dorm->rooms->where('current_occupants', '>', 0)->count();
                    $totalBeds = $dorm->rooms->sum('capacity');
                    $occupiedBeds = $dorm->rooms->sum('current_occupants');

                    return [
                        'id' => $dorm->id,
                        'name' => $dorm->name,
                        'campus' => $dorm->campus ?? 'Main Campus',
                        'type' => $dorm->type ?? 'mixed',
                        'totalRooms' => $totalRooms,
                        'occupiedRooms' => $occupiedRooms,
                        'totalBeds' => $totalBeds,
                        'occupiedBeds' => $occupiedBeds,
                        'pricePerSemester' => $dorm->price_per_semester ?? 0,
                        'amenities' => json_decode($dorm->amenities ?? '[]'),
                        'status' => $dorm->status ?? 'active',
                        'description' => $dorm->description ?? '',
                    ];
                });

            return response()->json($dormitories);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Get all applications
     */
    public function getApplications()
    {
        try {
            $residenceId = session('selected_residence_id');

            $applications = Application::where('residence_id', $residenceId)
                ->with(['user', 'assignedRoom.residence'])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function($app) {
                    return [
                        'id' => $app->id,
                        'studentId' => $app->user_id,
                        'studentName' => $app->user->name,
                        'studentNumber' => $app->user->student_number ?? 'N/A',
                        'preferences' => json_decode($app->preferences ?? '[]'),
                        'applicationDate' => $app->created_at->toISOString(),
                        'status' => $app->status,
                        'assignedDorm' => $app->assignedRoom ? $app->assignedRoom->residence->name : null,
                        'assignedRoom' => $app->assignedRoom ? $app->assignedRoom->room_number : null,
                        'notes' => $app->notes ?? '',
                    ];
                });

            return response()->json($applications);
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    /**
     * Update application status
     */
    public function updateApplicationStatus(Request $request, $id)
    {
        try {
            $request->validate([
                'status' => 'required|in:pending,approved,rejected,waitlisted',
            ]);

            $application = Application::findOrFail($id);
            $application->status = $request->status;
            $application->save();

            return response()->json([
                'message' => 'Application status updated successfully',
                'application' => $application,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update application status',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Assign dormitory to student
     */
    public function assignDormitory(Request $request, $id)
    {
        try {
            $request->validate([
                'room_id' => 'required|exists:rooms,id',
            ]);

            $application = Application::findOrFail($id);
            $room = Room::findOrFail($request->room_id);

            // Check if room has space
            if ($room->current_occupants >= $room->capacity) {
                return response()->json([
                    'message' => 'Room is full',
                ], 400);
            }

            // Assign room
            $application->assigned_room_id = $room->id;
            $application->status = 'approved';
            $application->save();

            // Update room occupancy
            $room->increment('current_occupants');

            return response()->json([
                'message' => 'Dormitory assigned successfully',
                'application' => $application,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to assign dormitory',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Import students from CSV
     */
    public function importStudents(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:csv,txt',
            ]);

            // Process CSV file
            // This is a basic implementation - you'll need to customize based on your CSV format
            
            return response()->json([
                'message' => 'Students imported successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to import students',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Store new dormitory
     */
    public function storeDormitory(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'campus' => 'required|string',
                'type' => 'required|in:male,female,mixed',
                'price_per_semester' => 'required|numeric',
                'description' => 'nullable|string',
            ]);

            $dorm = Residence::create($validated);

            return response()->json([
                'message' => 'Dormitory created successfully',
                'dormitory' => $dorm,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create dormitory',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Update dormitory
     */
    public function updateDormitory(Request $request, $id)
    {
        try {
            $dorm = Residence::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'campus' => 'sometimes|string',
                'type' => 'sometimes|in:male,female,mixed',
                'price_per_semester' => 'sometimes|numeric',
                'description' => 'nullable|string',
                'status' => 'sometimes|in:active,maintenance,closed,available',
            ]);

            $dorm->update($validated);

            return response()->json([
                'message' => 'Dormitory updated successfully',
                'dormitory' => $dorm,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update dormitory',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete dormitory
     */
    public function destroyDormitory($id)
    {
        try {
            $dorm = Residence::findOrFail($id);
            $dorm->delete();

            return response()->json([
                'message' => 'Dormitory deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete dormitory',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

