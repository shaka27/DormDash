<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\User;
use App\Models\GroupRole;
use App\Models\Group;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\GroupMember>
 */
class GroupMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'group_id'=>\App\Models\Group::inRandomOrder()->first()->id,
            'user_id'=>\App\Models\User::inRandomOrder()->first()->id,
            'gr_id'=>GroupRole::factory(),
        ];
    }
}
