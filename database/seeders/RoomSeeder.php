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
        $residences = Residence::take(3)->get();

        if ($residences->isEmpty()) {
            return; // Skip if no residences available
        }

        foreach ($residences as $residence) {
            // Create rooms for each residence
            for ($floor = 1; $floor <= 4; $floor++) {
                for ($roomNum = 1; $roomNum <= 10; $roomNum++) {
                    $statuses = ['Available', 'Occupied', 'Maintenance', 'Reserved'];
                    $status = $statuses[array_rand($statuses)];
                    
                    Room::create([
                        'residence_id' => $residence->id,
                        'number' => $floor . sprintf('%02d', $roomNum),
                        'status' => $status,
                    ]);
                }
            }
        }
    }
}