<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Seeder;

class BlogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create authors
        $authors = User::factory(5)->create();

        // Create categories
        $categories = Category::factory(8)->create();

        // Create tags
        $tags = Tag::factory(20)->create();

        // Create published posts
        $publishedPosts = Post::factory(30)
            ->published()
            ->recycle($authors)
            ->recycle($categories)
            ->create();

        // Create draft posts
        $draftPosts = Post::factory(10)
            ->draft()
            ->recycle($authors)
            ->recycle($categories)
            ->create();

        // Attach random tags to posts
        $allPosts = $publishedPosts->concat($draftPosts);
        
        foreach ($allPosts as $post) {
            $randomTags = $tags->random(random_int(1, 5));
            $post->tags()->attach($randomTags);
        }

        $this->command->info('Blog data seeded successfully!');
        $this->command->info("Created {$authors->count()} authors");
        $this->command->info("Created {$categories->count()} categories");
        $this->command->info("Created {$tags->count()} tags");
        $this->command->info("Created {$publishedPosts->count()} published posts");
        $this->command->info("Created {$draftPosts->count()} draft posts");
    }
}