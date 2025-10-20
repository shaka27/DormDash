<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Notification;
use App\Models\User;
use App\Models\Residence;

class NotificationFactory extends Factory
{
    protected $model = Notification::class;

    public function definition()
    {
        $residenceId = Residence::inRandomOrder()->value('id') ?? 1;
        $userId = User::whereNotNull('residence_id')->inRandomOrder()->value('id') ?? User::inRandomOrder()->value('id') ?? 1;

        return [
            'type' => $this->faker->randomElement(['announcement','technical','reminder','maintenance']),
            'content' => $this->faker->sentence(12),
            'residence_id' => $residenceId,
            'user_id' => $userId,
            'is_read' => $this->faker->boolean(20),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
