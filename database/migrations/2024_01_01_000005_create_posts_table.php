<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('The post title');
            $table->string('slug')->unique()->comment('The post URL slug');
            $table->text('excerpt')->nullable()->comment('Short post excerpt');
            $table->longText('content')->comment('The post content');
            $table->string('featured_image')->nullable()->comment('Featured image path');
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft')->comment('Post status');
            $table->integer('views_count')->default(0)->comment('Number of views');
            $table->integer('likes_count')->default(0)->comment('Number of likes');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->timestamp('published_at')->nullable()->comment('When the post was published');
            $table->timestamps();
            
            $table->index('status');
            $table->index('published_at');
            $table->index('views_count');
            $table->index('likes_count');
            $table->index(['status', 'published_at']);
            $table->index(['category_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('posts');
    }
};