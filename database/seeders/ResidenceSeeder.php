<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Residence;
use App\Models\Campus;

class ResidenceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get Potchefstroom Campus
        $campus = Campus::where('name', 'Potchefstroom Campus')->first();

        if (!$campus) {
            $this->command->error('Potchefstroom Campus not found. Please run CampusSeeder first.');
            return;
        }

        // Ladies' Residences
        $ladiesResidences = [
            'Eikenhof',
            'Heide',
            'Huis Republiek',
            'Karlien',
            'Kasteel',
            'Klawerhof',
            'Minjonet',
            'Oosterhof',
            'Vergeet-My-Nie',
            'Wag-\'n-Bietjie',
            'Wanda',
        ];

        // Men's Residences
        $mensResidences = [
            'Caput',
            'De Wilgers',
            'Excelsior',
            'Hombré',
            'Laureus',
            'Over-de-Voor',
            'Patria',
            'Ratau Lebone',
            'Veritas',
            'Dennedorp (PUK-Dorp Men\'s Residence)',
            'Soetdorings Men\'s Residence',
            'Invictus',
            'Siya Kolisi Residence',
        ];

        // Create all residences
        $allResidences = array_merge($ladiesResidences, $mensResidences);

        foreach ($allResidences as $residenceName) {
            Residence::firstOrCreate(
                ['name' => $residenceName, 'campus_id' => $campus->id],
                ['name' => $residenceName, 'campus_id' => $campus->id]
            );
        }

        $this->command->info('Created ' . count($allResidences) . ' residences for Potchefstroom Campus.');
    }
}
