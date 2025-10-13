<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User; //Import the User Model


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create 50 random users WITHOUT assigning them to rooms
        User::factory(50)->create([
            'room_id' => null,
            'bed_number' => null,
        ]);

        // Cleanup: ensure only our explicit test users have rooms
        $protectedEmails = [
            'student@example.com',
            'jane@example.com',
            'mike@example.com',
            'hc@example.com',
            'hp@example.com',
        ];
        User::whereNotIn('email', $protectedEmails)
            ->update(['room_id' => null, 'bed_number' => null]);

    }
}
