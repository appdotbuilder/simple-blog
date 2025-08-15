<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BlogTest extends TestCase
{
    use RefreshDatabase;

    public function test_blog_index_displays_published_posts(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        
        // Create published posts
        $publishedPosts = Post::factory(3)
            ->published()
            ->for($user, 'author')
            ->for($category)
            ->create();

        // Create draft posts (should not be displayed)
        Post::factory(2)
            ->draft()
            ->for($user, 'author')
            ->create();

        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) {
            $assert->component('welcome')
                ->has('posts.data', 3)
                ->has('categories')
                ->has('tags')
                ->has('filters');
        });
    }

    public function test_can_filter_posts_by_category(): void
    {
        $user = User::factory()->create();
        $category1 = Category::factory()->create(['slug' => 'tech']);
        $category2 = Category::factory()->create(['slug' => 'lifestyle']);

        Post::factory(2)->published()->for($user, 'author')->for($category1)->create();
        Post::factory(1)->published()->for($user, 'author')->for($category2)->create();

        $response = $this->get('/?category=tech');

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) {
            $assert->component('welcome')
                ->has('posts.data', 2)
                ->where('filters.category', 'tech');
        });
    }

    public function test_can_filter_posts_by_tag(): void
    {
        $user = User::factory()->create();
        $tag = Tag::factory()->create(['slug' => 'programming']);
        
        $posts = Post::factory(2)
            ->published()
            ->for($user, 'author')
            ->create();

        // Attach tag to posts
        foreach ($posts as $post) {
            $post->tags()->attach($tag);
        }

        // Create post without the tag
        Post::factory()->published()->for($user, 'author')->create();

        $response = $this->get('/?tag=programming');

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) {
            $assert->component('welcome')
                ->has('posts.data', 2)
                ->where('filters.tag', 'programming');
        });
    }

    public function test_can_search_posts(): void
    {
        $user = User::factory()->create();
        
        Post::factory()->published()
            ->for($user, 'author')
            ->create(['title' => 'Laravel Tutorial']);

        Post::factory()->published()
            ->for($user, 'author')
            ->create(['title' => 'React Guide']);

        $response = $this->get('/?search=Laravel');

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) {
            $assert->component('welcome')
                ->has('posts.data', 1)
                ->where('posts.data.0.title', 'Laravel Tutorial')
                ->where('filters.search', 'Laravel');
        });
    }

    public function test_can_sort_posts_by_date(): void
    {
        $user = User::factory()->create();
        
        $oldPost = Post::factory()->published()
            ->for($user, 'author')
            ->create(['published_at' => now()->subWeek()]);

        $newPost = Post::factory()->published()
            ->for($user, 'author')
            ->create(['published_at' => now()]);

        // Test newest first (default)
        $response = $this->get('/?sort=newest');
        $response->assertInertia(function ($assert) use ($newPost) {
            $assert->where('posts.data.0.title', $newPost->title);
        });

        // Test oldest first
        $response = $this->get('/?sort=oldest');
        $response->assertInertia(function ($assert) use ($oldPost) {
            $assert->where('posts.data.0.title', $oldPost->title);
        });
    }

    public function test_can_sort_posts_by_popularity(): void
    {
        $user = User::factory()->create();
        
        $popularPost = Post::factory()->published()
            ->for($user, 'author')
            ->create([
                'views_count' => 1000,
                'likes_count' => 100
            ]);

        $unpopularPost = Post::factory()->published()
            ->for($user, 'author')
            ->create([
                'views_count' => 10,
                'likes_count' => 1
            ]);

        $response = $this->get('/?sort=popular');

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) use ($popularPost) {
            $assert->where('posts.data.0.title', $popularPost->title);
        });
    }

    public function test_can_view_individual_blog_post(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();
        $tags = Tag::factory(2)->create();

        $post = Post::factory()->published()
            ->for($user, 'author')
            ->for($category)
            ->create();

        $post->tags()->attach($tags);

        $initialViews = $post->views_count;

        $response = $this->get("/posts/{$post->slug}");

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) use ($post) {
            $assert->component('blog/show')
                ->where('post.title', $post->title)
                ->where('post.content', $post->content)
                ->has('post.author')
                ->has('post.category')
                ->has('post.tags', 2)
                ->has('relatedPosts');
        });

        // Check that views count was incremented
        $this->assertDatabaseHas('posts', [
            'id' => $post->id,
            'views_count' => $initialViews + 1
        ]);
    }

    public function test_shows_related_posts(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $mainPost = Post::factory()->published()
            ->for($user, 'author')
            ->for($category)
            ->create();

        // Create related posts in same category
        $relatedPosts = Post::factory(2)
            ->published()
            ->for($user, 'author')
            ->for($category)
            ->create();

        // Create unrelated post in different category
        Post::factory()->published()
            ->for($user, 'author')
            ->create();

        $response = $this->get("/posts/{$mainPost->slug}");

        $response->assertStatus(200);
        $response->assertInertia(function ($assert) use ($relatedPosts) {
            $assert->has('relatedPosts', 2);
        });
    }
}