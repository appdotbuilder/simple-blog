<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Post;
use App\Models\Tag;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request)
    {
        $query = Post::query()
            ->with(['author', 'category', 'tags'])
            ->published();

        // Filter by category
        if ($request->filled('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by tag
        if ($request->filled('tag')) {
            $query->whereHas('tags', function ($q) use ($request) {
                $q->where('slug', $request->tag);
            });
        }

        // Search in title and content
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('title', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('content', 'LIKE', "%{$searchTerm}%")
                  ->orWhere('excerpt', 'LIKE', "%{$searchTerm}%");
            });
        }

        // Sort by date or popularity
        $sort = $request->get('sort', 'newest');
        switch ($sort) {
            case 'oldest':
                $query->orderBy('published_at', 'asc');
                break;
            case 'popular':
                $query->popular();
                break;
            case 'newest':
            default:
                $query->orderByDesc('published_at');
                break;
        }

        $posts = $query->paginate(12)->withQueryString();

        // Get all categories and tags for filters
        $categories = Category::whereHas('publishedPosts')
            ->withCount('publishedPosts')
            ->orderBy('name')
            ->get();

        $tags = Tag::whereHas('publishedPosts')
            ->withCount('publishedPosts')
            ->orderBy('name')
            ->get();

        return Inertia::render('welcome', [
            'posts' => $posts,
            'categories' => $categories,
            'tags' => $tags,
            'filters' => [
                'category' => $request->category,
                'tag' => $request->tag,
                'search' => $request->search,
                'sort' => $sort,
            ],
        ]);
    }

    /**
     * Display the specified blog post.
     */
    public function show(Post $post)
    {
        // Increment view count
        $post->increment('views_count');

        $post->load(['author', 'category', 'tags']);

        // Get related posts
        $relatedPosts = Post::published()
            ->with(['author', 'category'])
            ->where('id', '!=', $post->id)
            ->when($post->category_id, function ($query) use ($post) {
                $query->where('category_id', $post->category_id);
            })
            ->limit(3)
            ->get();

        return Inertia::render('blog/show', [
            'post' => $post,
            'relatedPosts' => $relatedPosts,
        ]);
    }
}