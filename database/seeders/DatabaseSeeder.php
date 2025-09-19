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
            UserSeeder::class,
            EventSeeder::class,
            RoleSeeder::class,
            ResidenceSeeder::class,
            CampusSeeder::class,
            RoomSeeder::class,
            BedSeeder::class,
            NotificationSeeder::class,
            MessageSeeder::class,
            GroupMembersSeeder::class,
            GroupSeeder::class,
            VoteResponseSeeder::class,
            VoteOptionSeeder::class,
            VoteSeeder::class,
            GroupRoleSeeder::class,

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
