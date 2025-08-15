import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarDays, Eye, Heart, Search, User } from '@/components/lucide-icons';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featured_image?: string;
    views_count: number;
    likes_count: number;
    published_at: string;
    author: {
        name: string;
    };
    category?: {
        id: number;
        name: string;
        slug: string;
        color: string;
    };
    tags: Array<{
        id: number;
        name: string;
        slug: string;
        color: string;
    }>;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    color: string;
    published_posts_count: number;
}

interface Tag {
    id: number;
    name: string;
    slug: string;
    color: string;
    published_posts_count: number;
}

interface Props {
    posts: {
        data: Post[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    categories: Category[];
    tags: Tag[];
    filters: {
        category?: string;
        tag?: string;
        search?: string;
        sort: string;
    };
    [key: string]: unknown;
}

export default function Welcome({ posts, categories, tags, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/', { ...filters, search: searchTerm }, {
            preserveState: true,
            replace: true,
        });
    };

    const handleFilter = (key: string, value: string | null) => {
        const newFilters: Record<string, string> = { ...filters };
        if (value) {
            newFilters[key] = value;
        } else {
            delete newFilters[key];
        }
        router.get('/', newFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        router.get('/', {}, {
            preserveState: true,
            replace: true,
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <>
            <Head title="📝 Simple Blog - Discover Amazing Stories" />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">
                                    📝 Simple Blog
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Discover amazing stories and insights from our community
                                </p>
                            </div>
                            
                            <div className="flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="outline">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button>
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Search and Filters */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search posts..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </form>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Select
                                    value={filters.category || ''}
                                    onValueChange={(value) => handleFilter('category', value || null)}
                                >
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.slug}>
                                                {category.name} ({category.published_posts_count})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={filters.sort}
                                    onValueChange={(value) => handleFilter('sort', value)}
                                >
                                    <SelectTrigger className="w-40">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">Newest</SelectItem>
                                        <SelectItem value="oldest">Oldest</SelectItem>
                                        <SelectItem value="popular">Most Popular</SelectItem>
                                    </SelectContent>
                                </Select>

                                {(filters.category || filters.tag || filters.search) && (
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="whitespace-nowrap"
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Active Filters */}
                        {(filters.category || filters.tag || filters.search) && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                {filters.search && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Search: "{filters.search}"
                                        <button
                                            onClick={() => handleFilter('search', null)}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                                {filters.category && (
                                    <Badge variant="secondary" className="flex items-center gap-1">
                                        Category: {categories.find(c => c.slug === filters.category)?.name}
                                        <button
                                            onClick={() => handleFilter('category', null)}
                                            className="ml-1 text-gray-500 hover:text-gray-700"
                                        >
                                            ×
                                        </button>
                                    </Badge>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tags Cloud */}
                    {tags.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Tags</h3>
                            <div className="flex flex-wrap gap-2">
                                {tags.slice(0, 15).map((tag) => (
                                    <button
                                        key={tag.id}
                                        onClick={() => handleFilter('tag', tag.slug)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                                            filters.tag === tag.slug
                                                ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                    >
                                        {tag.name} ({tag.published_posts_count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Info */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-600">
                            Showing {posts.data.length} of {posts.total} posts
                        </p>
                    </div>

                    {/* Posts Grid */}
                    {posts.data.length > 0 ? (
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {posts.data.map((post) => (
                                <Card key={post.id} className="hover:shadow-lg transition-shadow">
                                    {post.featured_image && (
                                        <div className="aspect-video overflow-hidden rounded-t-lg">
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    
                                    <CardHeader className="pb-3">
                                        {post.category && (
                                            <Badge
                                                variant="secondary"
                                                style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                                                className="w-fit mb-2"
                                            >
                                                {post.category.name}
                                            </Badge>
                                        )}
                                        
                                        <CardTitle className="text-xl leading-tight">
                                            <Link
                                                href={`/posts/${post.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {truncateText(post.title, 60)}
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <CardDescription className="text-base mb-4">
                                            {truncateText(post.excerpt, 120)}
                                        </CardDescription>

                                        {/* Tags */}
                                        {post.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {post.tags.slice(0, 3).map((tag) => (
                                                    <Badge
                                                        key={tag.id}
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        {/* Post Meta */}
                                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-1">
                                                    <User className="h-4 w-4" />
                                                    {post.author.name}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <CalendarDays className="h-4 w-4" />
                                                    {formatDate(post.published_at)}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats */}
                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-1">
                                                    <Eye className="h-4 w-4" />
                                                    {post.views_count.toLocaleString()}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Heart className="h-4 w-4" />
                                                    {post.likes_count.toLocaleString()}
                                                </div>
                                            </div>
                                            
                                            <Link href={`/posts/${post.slug}`}>
                                                <Button variant="ghost" size="sm">
                                                    Read More →
                                                </Button>
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📝</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                            <p className="text-gray-600 mb-4">
                                Try adjusting your filters or search terms to find what you're looking for.
                            </p>
                            <Button onClick={clearFilters} variant="outline">
                                Clear All Filters
                            </Button>
                        </div>
                    )}

                    {/* Pagination */}
                    {posts.last_page > 1 && (
                        <div className="mt-12 flex justify-center">
                            <div className="flex items-center gap-2">
                                {posts.links.map((link, index) => {
                                    if (!link.url) {
                                        return (
                                            <span
                                                key={index}
                                                className="px-3 py-2 text-gray-400"
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        );
                                    }

                                    return (
                                        <Link
                                            key={index}
                                            href={link.url}
                                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50 border'
                                            }`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <footer className="bg-gray-900 text-white mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">📝 Simple Blog</h3>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                A beautiful and simple blogging platform where stories come to life. 
                                Join our community of writers and readers sharing amazing content every day.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link href="/register">
                                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                                        Start Writing
                                    </Button>
                                </Link>
                                <Link href="/login">
                                    <Button variant="ghost" className="text-white hover:bg-gray-800">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                            <p className="text-gray-500 mt-8 text-sm">
                                © 2024 Simple Blog. Built with Laravel & Inertia.js
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}