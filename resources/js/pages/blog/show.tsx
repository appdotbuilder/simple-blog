import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CalendarDays, Eye, Heart, User, Clock } from '@/components/lucide-icons';

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

interface Props {
    post: Post;
    relatedPosts: Post[];
    [key: string]: unknown;
}

export default function BlogShow({ post, relatedPosts }: Props) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(' ').length;
        const minutes = Math.ceil(words / wordsPerMinute);
        return `${minutes} min read`;
    };

    return (
        <>
            <Head title={`${post.title} - Simple Blog`} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
                {/* Header */}
                <header className="bg-white shadow-sm border-b">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex items-center justify-between">
                            <Link href="/">
                                <Button variant="ghost" className="flex items-center gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Blog
                                </Button>
                            </Link>
                            
                            <div className="flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="outline" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link href="/register">
                                    <Button size="sm">
                                        Get Started
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Article */}
                <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                        {/* Featured Image */}
                        {post.featured_image && (
                            <div className="aspect-video md:aspect-[21/9] overflow-hidden">
                                <img
                                    src={post.featured_image}
                                    alt={post.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <div className="p-8 md:p-12">
                            {/* Category Badge */}
                            {post.category && (
                                <Badge
                                    variant="secondary"
                                    style={{ backgroundColor: post.category.color + '20', color: post.category.color }}
                                    className="mb-4"
                                >
                                    {post.category.name}
                                </Badge>
                            )}

                            {/* Title */}
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                                {post.title}
                            </h1>

                            {/* Excerpt */}
                            {post.excerpt && (
                                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                    {post.excerpt}
                                </p>
                            )}

                            {/* Meta Information */}
                            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-8 pb-8 border-b">
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <span className="font-medium">{post.author.name}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>{formatDate(post.published_at)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    <span>{formatReadTime(post.content)}</span>
                                </div>
                                <div className="flex items-center gap-4 ml-auto">
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-4 w-4" />
                                        <span>{post.views_count.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="h-4 w-4" />
                                        <span>{post.likes_count.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div 
                                className="prose prose-lg max-w-none prose-gray prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-a:font-medium hover:prose-a:text-blue-700 prose-strong:text-gray-900"
                                style={{ lineHeight: '1.8' }}
                            >
                                {post.content.split('\n').map((paragraph, index) => (
                                    paragraph.trim() && (
                                        <p key={index} className="mb-6">
                                            {paragraph}
                                        </p>
                                    )
                                ))}
                            </div>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag) => (
                                            <Link
                                                key={tag.id}
                                                href={`/?tag=${tag.slug}`}
                                                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                                            >
                                                #{tag.name}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </article>

                {/* Related Posts */}
                {relatedPosts.length > 0 && (
                    <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Posts</h2>
                        <div className="grid gap-6 md:grid-cols-3">
                            {relatedPosts.map((relatedPost) => (
                                <Card key={relatedPost.id} className="hover:shadow-lg transition-shadow">
                                    {relatedPost.featured_image && (
                                        <div className="aspect-video overflow-hidden rounded-t-lg">
                                            <img
                                                src={relatedPost.featured_image}
                                                alt={relatedPost.title}
                                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    
                                    <CardHeader className="pb-2">
                                        {relatedPost.category && (
                                            <Badge
                                                variant="secondary"
                                                style={{ backgroundColor: relatedPost.category.color + '20', color: relatedPost.category.color }}
                                                className="w-fit mb-2 text-xs"
                                            >
                                                {relatedPost.category.name}
                                            </Badge>
                                        )}
                                        
                                        <CardTitle className="text-base leading-tight">
                                            <Link
                                                href={`/posts/${relatedPost.slug}`}
                                                className="hover:text-blue-600 transition-colors"
                                            >
                                                {relatedPost.title.length > 50 
                                                    ? relatedPost.title.substring(0, 50) + '...'
                                                    : relatedPost.title
                                                }
                                            </Link>
                                        </CardTitle>
                                    </CardHeader>

                                    <CardContent className="pt-0">
                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <span>{relatedPost.author.name}</span>
                                            <div className="flex items-center gap-2">
                                                <Eye className="h-3 w-3" />
                                                {relatedPost.views_count.toLocaleString()}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </section>
                )}

                {/* Footer */}
                <footer className="bg-gray-900 text-white mt-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold mb-4">📝 Simple Blog</h3>
                            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
                                A beautiful and simple blogging platform where stories come to life.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <Link href="/register">
                                    <Button variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900">
                                        Start Writing
                                    </Button>
                                </Link>
                                <Link href="/">
                                    <Button variant="ghost" className="text-white hover:bg-gray-800">
                                        Browse Posts
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}