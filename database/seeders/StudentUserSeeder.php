<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Room;
use App\Models\Residence;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create test student users
        $students = [
            [
                'first_name' => 'John',
                'last_name' => 'Doe',
                'email' => 'student@example.com',
                'contact_num' => '0123456789',
                'password' => Hash::make('password123'),
                'gender' => 'male',
                'student_number' => 'STU001',
            ],
            [
                'first_name' => 'Jane',
                'last_name' => 'Smith',
                'email' => 'jane@example.com',
                'contact_num' => '0987654321',
                'password' => Hash::make('password123'),
                'gender' => 'female',
                'student_number' => 'STU002',
            ],
            [
                'first_name' => 'Mike',
                'last_name' => 'Johnson',
                'email' => 'mike@example.com',
                'contact_num' => '0555444333',
                'password' => Hash::make('password123'),
                'gender' => 'male',
                'student_number' => 'STU003',
            ]
        ];

        $studentRole = Role::where('description', 'Student')->first();

        foreach ($students as $studentData) {
            $student = User::firstOrCreate(
                ['email' => $studentData['email']],
                $studentData
            );

            // Attach Student role
            if ($studentRole && !$student->roles->contains($studentRole->id)) {
                $student->roles()->attach($studentRole->id);
            }
        }

        // Deterministic room assignment for students (pinned to specific residence and room numbers)
        $residence = Residence::orderBy('id')->first();
        if ($residence) {
            // All rooms in target residence ordered by number
            $allRooms = Room::where('residence_id', $residence->id)
                ->orderBy('number')
                ->get();

            // Track rooms already used
            $usedRoomIds = User::whereNotNull('room_id')->pluck('room_id')->toArray();

            // Pin specific rooms for our named test students if available
            $pinMap = [
                'student@example.com' => 101,
                'jane@example.com'    => 102,
                'mike@example.com'    => 103,
            ];

            foreach ($pinMap as $email => $roomNumber) {
                $u = User::where('email', $email)->first();
                if ($u && !$u->room_id) {
                    $room = $allRooms->firstWhere('number', $roomNumber);
                    if ($room && !in_array($room->id, $usedRoomIds, true)) {
                        $u->room_id = $room->id;
                        $u->save();
                        $usedRoomIds[] = $room->id;
                    }
                }
            }

            // Assign remaining Student-role users without a room to next available rooms
            if ($studentRole) {
                $remainingStudents = User::whereNull('room_id')
                    ->whereHas('roles', function ($q) use ($studentRole) {
                        $q->where('role.id', $studentRole->id);
                    })
                    ->whereNotIn('email', array_keys($pinMap))
                    ->orderBy('email')
                    ->get();

                // Build a list of available rooms not already used
                $availableRooms = $allRooms->reject(function ($r) use ($usedRoomIds) {
                    return in_array($r->id, $usedRoomIds, true);
                })->values();

                $idx = 0;
                foreach ($remainingStudents as $stu) {
                    if (!isset($availableRooms[$idx])) {
                        break; // no more rooms to assign
                    }
                    $room = $availableRooms[$idx];
                    $stu->room_id = $room->id;
                    $stu->save();
                    $idx++;
                }
            }
        }

        // Create House Committee member for testing
        $houseCommittee = User::firstOrCreate(
            ['email' => 'hc@example.com'],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Wilson',
                'email' => 'hc@example.com',
                'contact_num' => '0666777888',
                'password' => Hash::make('password123'),
                'gender' => 'female',
                'student_number' => 'HC001',
            ]
        );

        $hcRole = Role::where('description', 'HouseCommittee')->first();
        if ($hcRole && !$houseCommittee->roles->contains($hcRole->id)) {
            $houseCommittee->roles()->attach($hcRole->id);
        }

        // Create House Parent for testing
        $houseParent = User::firstOrCreate(
            ['email' => 'hp@example.com'],
            [
                'first_name' => 'Robert',
                'last_name' => 'Brown',
                'email' => 'hp@example.com',
                'contact_num' => '0999888777',
                'password' => Hash::make('password123'),
                'gender' => 'male',
                'student_number' => 'HP001',
            ]
        );

        $hpRole = Role::where('description', 'HouseParent')->first();
        if ($hpRole && !$houseParent->roles->contains($hpRole->id)) {
            $houseParent->roles()->attach($hpRole->id);
        }
    }
}
