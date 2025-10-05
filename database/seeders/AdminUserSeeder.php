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
                'first_name' => 'denzel',
                'last_name' => 'verster',
                'email' => 'evankyletitus27@gmail.com',
                'contact_num' => '0123456789',
                'password' => Hash::make('admin1234'),
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
