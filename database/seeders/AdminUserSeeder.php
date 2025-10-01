<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::firstOrCreate(
            ['email' => 'rikus.swart@greenbit.dev'],
            [
                'first_name' => 'Rikus',
                'last_name' => 'Swart',
                'email' => 'rikus.swart@greenbit.dev',
                'contact_num' => '0123456789',
                'password' => Hash::make('Test1234'),
                'gender' => 'male',
            ]
        );

        // Attach Admin role
        $adminRole = Role::where('description', 'Admin')->first();
        if ($adminRole && !$admin->roles->contains($adminRole->id)) {
            $admin->roles()->attach($adminRole->id);
        }
    }
}
