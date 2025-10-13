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
        // Constants per requirements
        $DEFAULT_CAPACITY = 3; // capacity should always be 3
        $DEFAULT_TYPE = 'Residence'; // type description should always display " Residence"

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

        // Assign each named student a unique RANDOM room in the first residence
        $residence = Residence::orderBy('id')->first();
        if ($residence) {
            $targetEmails = ['student@example.com', 'jane@example.com', 'mike@example.com'];
            $targetStudents = User::whereIn('email', $targetEmails)->get()->keyBy('email');

            // Rooms in the residence that are not used by OTHER users
            $usedByOthers = User::whereNotNull('room_id')
                ->whereNotIn('email', $targetEmails)
                ->pluck('room_id')
                ->toArray();

            // Only use rooms that are Available or Occupied
            $availableRooms = Room::where('residence_id', $residence->id)
                ->whereNotIn('id', $usedByOthers)
                ->whereIn('status', ['Available', 'Occupied'])
                ->pluck('id')
                ->toArray();

            // Ensure we have at least 3 rooms; if not, mark additional candidate rooms as Available
            if (count($availableRooms) < count($targetEmails)) {
                $candidates = Room::where('residence_id', $residence->id)
                    ->whereNotIn('id', array_merge($usedByOthers, $availableRooms))
                    ->pluck('id')
                    ->toArray();
                foreach ($candidates as $cid) {
                    if (count($availableRooms) >= count($targetEmails)) break;
                    $r = Room::find($cid);
                    if ($r) {
                        $r->status = 'Available';
                        $r->save();
                        $availableRooms[] = $r->id;
                    }
                }
            }

            shuffle($availableRooms);

            // Ensure we have at least 3 unique rooms
            $assignedRoomIds = [];
            foreach ($targetEmails as $email) {
                $u = $targetStudents->get($email);
                if (!$u) { continue; }

                // Pick next unused room id
                $roomId = null;
                foreach ($availableRooms as $rid) {
                    if (!in_array($rid, $assignedRoomIds, true)) {
                        $roomId = $rid;
                        $assignedRoomIds[] = $rid;
                        break;
                    }
                }
                if (!$roomId) { break; }

                $room = Room::find($roomId);
                if (!$room) { continue; }

                // Enforce constants and persist floor if missing
                $changed = false;
                if ($room->capacity !== $DEFAULT_CAPACITY || $room->type !== $DEFAULT_TYPE) {
                    $room->capacity = $DEFAULT_CAPACITY;
                    $room->type = $DEFAULT_TYPE;
                    $changed = true;
                }
                if (is_null($room->floor)) {
                    $room->floor = random_int(1, 3);
                    $changed = true;
                }
                if ($changed) { $room->save(); }

                // Assign user to room and persist a bed number if missing
                $u->room_id = $room->id;
                if (is_null($u->bed_number)) {
                    $u->bed_number = random_int(1, 3);
                }
                $u->save();
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
