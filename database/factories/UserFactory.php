<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;


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
        ];
    }
}
