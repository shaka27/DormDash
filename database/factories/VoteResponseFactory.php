<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Vote;
use App\Models\User;
use App\Models\VoteOption;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\VoteResopnse>
 */
class VoteResponseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vote_id'=>Vote::factory(),
            'user_id'=>\App\Models\User::inRandomOrder()->first()->id,
            'vote_option_id'=>VoteOption::factory(),
        ];
    }
}
