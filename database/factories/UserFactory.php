<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'first_name'=>fake()->name(),
            'last_name'=>fake()->name(),
            'email'=>fake()->unique()->safeEmail(),
            'contact_num'=>fake()->optional()->phoneNumber(),
            'password'=>bcrypt('password'),
            'gender'=>fake()->randomElement(['male', 'female', 'other']),
            'remember_token'    => Str::random(10),
        ];
    }
}
