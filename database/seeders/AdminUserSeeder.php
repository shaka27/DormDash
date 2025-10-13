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
                'first_name' => 'AJ',
                'last_name' => 'Mostert',
                'email' => '12ajmostert12@gmail.com',
                'contact_num' => '0634109673',
                'password' => Hash::make('admin1234'),
                'gender' => 'male',
                'student_number'=>'49351893'
            ]
        );
        

        // Attach Admin role
        $adminRole = Role::where('description', 'Admin')->first();
        if ($adminRole && !$admin->roles->contains($adminRole->id)) {
            $admin->roles()->attach($adminRole->id);
        }
    }
}
