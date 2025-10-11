<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use App\Models\Residence;
use App\Models\Room;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => fake()->firstName(),
            'last_name'  => fake()->lastName(),
            'email'      => fake()->unique()->safeEmail(),
            'contact_num'=> fake()->optional()->phoneNumber(),
            'password'   => bcrypt('password'),
            'gender'     => fake()->randomElement(['male', 'female', 'other']),
            'remember_token' => Str::random(10),
            'student_number'=>fake()->unique()->numerify('########'),
            'residence_id'=>\App\Models\Residence::inRandomOrder()->first()->id,
            'room_id'=>\App\Models\Room::inRandomOrder()->first()->id,
            'move_in_date' => fake()-> dateTimeBetween('-5 year', '+1 month'),
            'expected_move_out'=> fake()-> dateTimeBetween('-3 week', '+3 year'),
            'emergency_contact_name'=> fake()->name(),
            'emergency_contact_relation'=>fake() -> word(),
            'emergency_contact_phone'=>fake()->optional()->phoneNumber(),
        ];
    }
}
