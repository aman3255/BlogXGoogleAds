import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, Eye, Heart, Tag, Share2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { GoogleAd, AdPlaceholder } from '../components/ads/GoogleAd';
import { apiService } from '../services/api';
import { Blog } from '../types';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchBlog(slug);
    }
  }, [slug]);

  const fetchBlog = async (blogSlug: string) => {
    try {
      const response = await apiService.getBlogBySlug(blogSlug);
      if (response.success && response.data) {
        // Only show published blogs
        if (response.data.status === 'published') {
          setBlog(response.data);
        } else {
          setError('Blog not found or not published');
        }
      } else {
        setError(response.error || 'Blog not found');
      }
    } catch (error) {
      setError('Failed to load blog');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleLike = () => {
    setLiked(!liked);
    // TODO: Implement like functionality with API
  };

  const handleShare = async () => {
    if (navigator.share && blog) {
      try {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: window.location.href,
        });
      } catch (error) {
        // Fallback to copying URL
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The blog you are looking for does not exist.'}</p>
          <Link to="/">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const contentParagraphs = blog.content.split('\n\n');
  const middleIndex = Math.floor(contentParagraphs.length / 2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Back Button */}
            <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>

            <Card className="overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
                <div className="flex items-center space-x-2 mb-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    Published
                  </Badge>
                  {blog.featured && (
                    <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-300/30">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                  {blog.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-blue-100">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{blog.author.fullName}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{blog.readTime || estimateReadTime(blog.content)} min read</span>
                  </div>
                  
                  {blog.views && (
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>{blog.views.toLocaleString()} views</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              {blog.photo && (
                <div className="aspect-video bg-gray-100">
                  <img 
                    src={blog.photo} 
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              )}

              {/* Content */}
              <div className="p-8">
                {/* Excerpt */}
                {blog.excerpt && (
                  <div className="mb-8 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                    <p className="text-lg text-blue-900 font-medium leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                )}

                {/* Top Ad Placement */}
                {blog.adSettings?.showAds && blog.adSettings.adPlacement.includes('top') && (
                  <div className="mb-8">
                    {process.env.NODE_ENV === 'production' ? (
                      <GoogleAd adSlot="1234567890" adFormat="rectangle" />
                    ) : (
                      <AdPlaceholder placement="Top" />
                    )}
                  </div>
                )}

                {/* Article Content */}
                <div className="prose prose-lg max-w-none">
                  {contentParagraphs.map((paragraph, index) => (
                    <div key={index}>
                      <p className="mb-6 text-gray-800 leading-relaxed">
                        {paragraph}
                      </p>
                      
                      {/* Middle Ad Placement */}
                      {index === middleIndex && 
                       blog.adSettings?.showAds && 
                       blog.adSettings.adPlacement.includes('middle') && (
                        <div className="my-8">
                          {process.env.NODE_ENV === 'production' ? (
                            <GoogleAd adSlot="0987654321" adFormat="rectangle" />
                          ) : (
                            <AdPlaceholder placement="Middle" />
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Bottom Ad Placement */}
                {blog.adSettings?.showAds && blog.adSettings.adPlacement.includes('bottom') && (
                  <div className="mt-8">
                    {process.env.NODE_ENV === 'production' ? (
                      <GoogleAd adSlot="1122334455" adFormat="rectangle" />
                    ) : (
                      <AdPlaceholder placement="Bottom" />
                    )}
                  </div>
                )}

                {/* Tags and Category */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {blog.category && (
                      <div className="flex items-center space-x-2">
                        <Tag className="w-4 h-4 text-gray-500" />
                        <Badge variant="info">{blog.category}</Badge>
                      </div>
                    )}
                    
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {blog.tags.map((tag, index) => (
                          <Badge key={index} variant="default">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Button
                        variant={liked ? "primary" : "outline"}
                        size="sm"
                        onClick={handleLike}
                      >
                        <Heart className={`w-4 h-4 mr-2 ${liked ? 'fill-current' : ''}`} />
                        {liked ? 'Liked' : 'Like'} ({(blog.likes || 0) + (liked ? 1 : 0)})
                      </Button>
                      
                      <Button variant="outline" size="sm" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Author Info */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-semibold text-blue-600">
                        {blog.author.fullName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{blog.author.fullName}</h3>
                      <p className="text-gray-600">@{blog.author.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sidebar Ad Placement */}
            {blog.adSettings?.showAds && blog.adSettings.adPlacement.includes('sidebar') && (
              <Card className="p-4">
                {process.env.NODE_ENV === 'production' ? (
                  <GoogleAd 
                    adSlot="5566778899" 
                    adFormat="vertical"
                    style={{ minHeight: '300px' }}
                  />
                ) : (
                  <AdPlaceholder placement="Sidebar" className="min-h-[300px]" />
                )}
              </Card>
            )}

            {/* Related Articles Placeholder */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">Related articles coming soon...</p>
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Updated</h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest blogs delivered to your inbox
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button size="sm" className="w-full">
                  Subscribe
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};