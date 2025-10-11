<?php

namespace Database\Seeders;

use App\Models\Notification;
use App\Models\User;
use App\Models\Residence;
use Illuminate\Database\Seeder;

class NotificationSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Notification::factory(100)->create();

        // Get the first residence and users
        $residence = Residence::first();
        $users = User::take(5)->get();
        $admin = User::whereHas('roles', function($query) {
            $query->where('description', 'Admin');
        })->first();

        if (!$residence || $users->isEmpty() || !$admin) {
            return; // Skip if no data available
        }

        $notifications = [
            [
                'type' => 'announcement',
                'content' => 'Water maintenance scheduled for Building C on Friday from 8:00 AM to 12:00 PM. Please store water if needed.',
                'is_read' => false,
                'user_id' => $admin->id,
                'recipient_id' => $users[0]->id,
                'residence_id' => $residence->id,
            ],
            [
                'type' => 'technical',
                'content' => 'New WiFi password is now available. Check the residence notice board for updated credentials.',
                'is_read' => false,
                'user_id' => $admin->id,
                'recipient_id' => $users[1]->id,
                'residence_id' => $residence->id,
            ],
            [
                'type' => 'announcement',
                'content' => 'Voting is now open for House Captain Elections. Cast your vote by Friday at 5:00 PM.',
                'is_read' => true,
                'user_id' => $admin->id,
                'recipient_id' => $users[2]->id,
                'residence_id' => $residence->id,
            ],
            [
                'type' => 'reminder',
                'content' => 'Don\'t forget about the House Committee Meeting tomorrow at 2:00 PM in Common Room A.',
                'is_read' => false,
                'user_id' => $admin->id,
                'recipient_id' => $users[3]->id,
                'residence_id' => $residence->id,
            ],
            [
                'type' => 'maintenance',
                'content' => 'Elevator maintenance completed. All elevators are now fully operational.',
                'is_read' => false,
                'user_id' => $admin->id,
                'recipient_id' => $users[4]->id ?? $users[0]->id,
                'residence_id' => $residence->id,
            ]
        ];

        foreach ($notifications as $notificationData) {
            Notification::create($notificationData);
        }

        // Create additional notifications for other users
        if ($users->count() > 1) {
            foreach ($users->skip(1) as $user) {
                Notification::create([
                    'type' => 'announcement',
                    'content' => 'Welcome to the residence! Please read the residence handbook available at the front desk.',
                    'is_read' => false,
                    'user_id' => $admin->id,
                    'recipient_id' => $user->id,
                    'residence_id' => $residence->id,
                ]);
            }
        }
    }
}