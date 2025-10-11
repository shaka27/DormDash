<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $this->call([
            RoleSeeder::class,
            CampusSeeder::class,
            ResidenceSeeder::class,
            AdminUserSeeder::class,
            StudentUserSeeder::class,
            EventSeeder::class,
            RoomSeeder::class,
            NotificationSeeder::class,
            GroupSeeder::class,        
            ChatroomSeeder::class,
            UserSeeder::class,
            GroupMemberSeeder::class,
            MessageSeeder::class,
            GroupRoleSeeder::class,
            // BedSeeder::class,
            // VoteResponseSeeder::class,
            // VoteOptionSeeder::class,
            // VoteSeeder::class,

        ]);

        // User::factory()->create([
        //     'first_name'  => 'Test',
        //     'last_name'   => 'User',
        //     'email'       => 'test@example.com',
        //     'contact_num' => '0123456789',
        //     'password'    => bcrypt('password'),
        //     'gender'      => 'male',
        // ]);
    }
}
