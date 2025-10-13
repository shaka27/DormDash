<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
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
            ],
            [
                'first_name' => 'Mlondi',
                'last_name' => 'Gcaba',
                'email' => 'mlondigcaba@example.com',
                'contact_num' => '0607818656',
                'password' => Hash::make('pass123'),
                'gender' => 'male',
                'student_number' => 'STU004',
            ]
        ];

        $studentRole = Role::where('description', 'Student')->first();

        foreach ($students as $studentData) {
            $student = User::firstOrCreate(
                ['email' => $studentData['email']],
                $studentData
            );

            // Attach Student role (use syncWithoutDetaching to avoid contains() on a null relation
            // and prevent duplicate attachments)
            if ($studentRole) {
                $student->roles()->syncWithoutDetaching($studentRole->id);
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
        if ($hcRole) {
            $houseCommittee->roles()->syncWithoutDetaching($hcRole->id);
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
        if ($hpRole) {
            $houseParent->roles()->syncWithoutDetaching($hpRole->id);
        }
    }
}
