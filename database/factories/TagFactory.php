<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Tag>
 */
class TagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->word();
        $colors = ['#6B7280', '#9CA3AF', '#374151', '#1F2937', '#111827', '#4B5563'];

        return [
            'name' => ucfirst($name),
            'slug' => Str::slug($name),
            'color' => fake()->randomElement($colors),
        ];
    }
}