<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        Event::factory(20)->create();

        $events = [
            [
                'name' => 'House Committee Meeting',
                'description' => 'Monthly meeting to discuss residence matters and upcoming events.',
                'date' => now()->addDays(1)->format('Y-m-d H:i:s'),
                'location' => 'Common Room A'
            ],
            [
                'name' => 'Braai Day Celebration',
                'description' => 'Join us for a traditional South African braai with music and games.',
                'date' => now()->addDays(3)->format('Y-m-d H:i:s'),
                'location' => 'Residence Garden'
            ],
            [
                'name' => 'Study Group - Mathematics',
                'description' => 'Weekly study session for first-year mathematics students.',
                'date' => now()->addDays(5)->format('Y-m-d H:i:s'),
                'location' => 'Study Hall'
            ],
            [
                'name' => 'Movie Night',
                'description' => 'Watch the latest blockbuster with your residence mates.',
                'date' => now()->addDays(7)->format('Y-m-d H:i:s'),
                'location' => 'Common Room B'
            ],
            [
                'name' => 'Sports Day',
                'description' => 'Inter-residence sports competition including soccer, basketball, and volleyball.',
                'date' => now()->addDays(10)->format('Y-m-d H:i:s'),
                'location' => 'Sports Field'
            ],
            [
                'name' => 'Career Fair',
                'description' => 'Meet with potential employers and learn about career opportunities.',
                'date' => now()->addDays(14)->format('Y-m-d H:i:s'),
                'location' => 'Main Hall'
            ]
        ];

        foreach ($events as $eventData) {
            Event::create($eventData);
        }
    }
}
