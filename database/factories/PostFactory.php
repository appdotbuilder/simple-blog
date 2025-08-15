<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->sentence(random_int(4, 8));
        $isPublished = fake()->boolean(80); // 80% chance of being published

        return [
            'title' => rtrim($title, '.'),
            'slug' => Str::slug($title),
            'excerpt' => fake()->paragraph(2),
            'content' => fake()->paragraphs(random_int(5, 12), true),
            'featured_image' => fake()->boolean(60) ? 'https://picsum.photos/800/400?random=' . fake()->numberBetween(1, 1000) : null,
            'status' => $isPublished ? 'published' : fake()->randomElement(['draft', 'archived']),
            'views_count' => $isPublished ? fake()->numberBetween(0, 5000) : 0,
            'likes_count' => $isPublished ? fake()->numberBetween(0, 500) : 0,
            'user_id' => User::factory(),
            'category_id' => fake()->boolean(90) ? Category::factory() : null,
            'published_at' => $isPublished ? fake()->dateTimeBetween('-1 year', 'now') : null,
        ];
    }

    /**
     * Indicate that the post is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
            'views_count' => fake()->numberBetween(10, 5000),
            'likes_count' => fake()->numberBetween(0, 500),
        ]);
    }

    /**
     * Indicate that the post is a draft.
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
            'views_count' => 0,
            'likes_count' => 0,
        ]);
    }
}