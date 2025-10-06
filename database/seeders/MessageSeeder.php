<?php

namespace Database\Seeders;

use App\Models\Message;
use App\Models\User;
use Illuminate\Database\Seeder;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::take(4)->get();

        if ($users->count() < 2) {
            return; // Skip if not enough users
        }

        $messages = [
            [
                'sender_id' => $users[0]->id,
                'receiver_id' => $users[1]->id,
                'message' => 'Hey! Are you still up for the math study group tonight at 7 PM in the study hall?',
            ],
            [
                'sender_id' => $users[1]->id,
                'receiver_id' => $users[0]->id,
                'message' => 'Yes, definitely! I\'ll bring the practice problems we discussed yesterday.',
            ],
            [
                'sender_id' => $users[2]->id ?? $users[0]->id,
                'receiver_id' => $users[1]->id,
                'message' => 'Just a reminder that room inspections are tomorrow at 10 AM. Make sure everything is tidy!',
            ],
            [
                'sender_id' => $users[1]->id,
                'receiver_id' => $users[3]->id ?? $users[2]->id,
                'message' => 'Have you been experiencing slow WiFi in your room too? It\'s been really bad today.',
            ],
            [
                'sender_id' => $users[0]->id,
                'receiver_id' => $users[1]->id,
                'message' => 'The braai event is coming up! Do you want to help organize the food and drinks?',
            ]
        ];

        foreach ($messages as $messageData) {
            Message::create($messageData);
        }
    }
}