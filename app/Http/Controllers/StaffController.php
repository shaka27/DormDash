<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\User;
use App\Models\Room;
use App\Models\Bed;

class StaffController extends Controller
{
    /**
     * Display the staff dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $totalStudents = User::whereHas('roles', function($query) {
            $query->where('name', 'Student');
        })->count();

        $occupancyRate = $this->calculateOccupancyRate();

        // TODO: Replace these hardcoded values with real queries from your models
        $pendingRequests = 12; // Example: MaintenanceRequest::where('status', 'pending')->count();
        $urgentIssues = 3;      // Example: UrgentIssue::where('resolved', false)->count();

        return Inertia::render('Staff', [
            'page' => 'dashboard',
            'stats' => [
                'totalStudents' => $totalStudents,
                'occupancyRate' => $occupancyRate,
                'pendingRequests' => $pendingRequests,
                'urgentIssues' => $urgentIssues,
            ],
        ]);
    }

    /**
     * Display the students management page.
     *
     * @return \Inertia\Response
     */
    public function students()
    {
        $students = User::whereHas('roles', function($query) {
                $query->where('name', 'Student');
            })
            ->with('bed.room')
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'room' => $student->bed ? $student->bed->room->name : 'Unassigned',
                    'status' => $student->status ?? 'Active',
                    'phone' => $student->phone ?? 'N/A',
                    'checkIn' => $student->created_at->format('Y-m-d'),
                ];
            });

        return Inertia::render('Staff', [
            'page' => 'students',
            'students' => $students,
        ]);
    }

    /**
     * Display the maintenance page.
     *
     * @return \Inertia\Response
     */
    public function maintenance()
    {
        // TODO: Replace this hardcoded data with real queries from your Maintenance model
        $workOrders = [
            [
                'id' => 1,
                'room' => '204A',
                'issue' => 'Air conditioner not working',
                'priority' => 'High',
                'status' => 'In Progress',
                'assignedTo' => 'Tom Wilson',
            ],
            [
                'id' => 2,
                'room' => '301B',
                'issue' => 'Leaky faucet in bathroom',
                'priority' => 'Medium',
                'status' => 'Pending',
                'assignedTo' => 'Unassigned',
            ],
            [
                'id' => 3,
                'room' => '105A',
                'issue' => 'Light bulb replacement',
                'priority' => 'Low',
                'status' => 'Completed',
                'assignedTo' => 'Mike Brown',
            ],
        ];

        return Inertia::render('Staff', [
            'page' => 'maintenance',
            'workOrders' => $workOrders,
        ]);
    }

    /**
     * Display the tasks page.
     *
     * @return \Inertia\Response
     */
    public function tasks()
    {
        // TODO: Replace this hardcoded data with real data from your Task or Role models
        $staffRoles = [
            ['label' => 'Cafeteria Services', 'value' => 'Cafeteria Services'],
            ['label' => 'Food & Beverages Services', 'value' => 'Food & Beverages Services'],
            ['label' => 'Hospitality Services', 'value' => 'Hospitality Services'],
            ['label' => 'Residence Services', 'value' => 'Residence Services'],
        ];

        $tasksByRole = [
            'Cafeteria Services' => [
                'Food Preparation',
                'Setting up tables, linens, dinnerware, and serving equipment',
                'Cleaning all equipment',
            ],
            'Food & Beverages Services' => [
                'Restocking supplies, ingredients, and beverage inventories',
                'Handling customer complaints and special requests',
            ],
            'Hospitality Services' => [
                'Checking guests in and out of accommodations',
                'Handling room assignments',
                'Setting up meeting rooms or event spaces for functions',
            ],
            'Residence Services' => [
                'Performing routine cleaning of living spaces, kitchens, and bathrooms',
                'Maintaining outdoor areas including gardens, pools, and recreational facilities',
                'Ensuring compliance with residence policies and safety protocols',
            ],
        ];

        return Inertia::render('Staff', [
            'page' => 'tasks',
            'staffRoles' => $staffRoles,
            'tasksByRole' => $tasksByRole,
        ]);
    }

    /**
     * Display the reports page.
     *
     * @return \Inertia\Response
     */
    public function reports()
    {
        return Inertia::render('Staff', [
            'page' => 'reports',
        ]);
    }

    /**
     * Calculate the occupancy rate of the residence.
     *
     * @return int
     */
    private function calculateOccupancyRate()
    {
        $totalBeds = Bed::count();
        $occupiedBeds = Bed::whereNotNull('user_id')->count();
        
        if ($totalBeds === 0) {
            return 0;
        }
        
        return round(($occupiedBeds / $totalBeds) * 100);
    }
}