<?php

namespace Database\Seeders;

use App\Models\Room;
use App\Models\Residence;
use Illuminate\Database\Seeder;

class RoomSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed rooms for ALL residences, not just a subset
        $residences = Residence::all();

        if ($residences->isEmpty()) {
            return; // Skip if no residences available
        }

        foreach ($residences as $residence) {
            // Create rooms for each residence (idempotent via firstOrCreate)
            for ($floor = 1; $floor <= 4; $floor++) {
                for ($roomNum = 1; $roomNum <= 10; $roomNum++) {
                    $statuses = ['Available', 'Occupied', 'Maintenance', 'Reserved'];
                    $status = $statuses[array_rand($statuses)];

                    $number = (int)($floor . sprintf('%02d', $roomNum));

                    Room::firstOrCreate(
                        [
                            'residence_id' => $residence->id,
                            'number' => $number,
                        ],
                        [
                            'status' => $status,
                            'floor' => $floor,
                            'capacity' => 3,
                            'type' => 'Residence',
                        ]
                    );
                }
            }
        }
    }
}
