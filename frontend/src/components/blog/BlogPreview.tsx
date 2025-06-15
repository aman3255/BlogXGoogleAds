import React from 'react';
import { Calendar, Clock, User, Eye, Heart, Tag } from 'lucide-react';
import { CreateBlogData } from '../../types';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

interface BlogPreviewProps {
  blogData: CreateBlogData;
  author: {
    fullName: string;
    username: string;
  };
}

export const BlogPreview: React.FC<BlogPreviewProps> = ({ blogData, author }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
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

  const generateExcerpt = (content: string, excerpt?: string) => {
    if (excerpt) return excerpt;
    return content.substring(0, 200) + (content.length > 200 ? '...' : '');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="flex items-center space-x-2 mb-4">
            <Badge className="bg-white/20 text-white border-white/30">
              {blogData.status === 'published' ? 'Published' : 'Draft'}
            </Badge>
            {blogData.featured && (
              <Badge className="bg-yellow-500/20 text-yellow-100 border-yellow-300/30">
                Featured
              </Badge>
            )}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {blogData.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-blue-100">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>{author.fullName}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(new Date())}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>{estimateReadTime(blogData.content)} min read</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4" />
              <span>0 views</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>0 likes</span>
            </div>
          </div>
        </div>

        {/* Photo */}
        {blogData.photo && (
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <img 
              src={blogData.photo} 
              alt={blogData.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `
                  <div class="flex items-center justify-center h-full text-gray-400">
                    <div class="text-center">
                      <div class="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
                        <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <p>Image not available</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Excerpt */}
          {(blogData.excerpt || blogData.content) && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                {generateExcerpt(blogData.content, blogData.excerpt)}
              </p>
            </div>
          )}

          {/* Ad Placement - Top */}
          {blogData.adSettings?.showAds && blogData.adSettings.adPlacement.includes('top') && (
            <div className="mb-8 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500 font-medium">Google Ad Placement - Top</p>
              <p className="text-sm text-gray-400">Advertisement will appear here</p>
            </div>
          )}

          {/* Main Content */}
          <div className="prose prose-lg max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
              {blogData.content.split('\n\n').map((paragraph, index) => {
                const isMiddle = index === Math.floor(blogData.content.split('\n\n').length / 2);
                
                return (
                  <div key={index}>
                    <p className="mb-6">{paragraph}</p>
                    
                    {/* Ad Placement - Middle */}
                    {isMiddle && blogData.adSettings?.showAds && blogData.adSettings.adPlacement.includes('middle') && (
                      <div className="my-8 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <p className="text-gray-500 font-medium">Google Ad Placement - Middle</p>
                        <p className="text-sm text-gray-400">Advertisement will appear here</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ad Placement - Bottom */}
          {blogData.adSettings?.showAds && blogData.adSettings.adPlacement.includes('bottom') && (
            <div className="mt-8 p-4 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <p className="text-gray-500 font-medium">Google Ad Placement - Bottom</p>
              <p className="text-sm text-gray-400">Advertisement will appear here</p>
            </div>
          )}

          {/* Tags and Category */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex flex-wrap items-center gap-4">
              {blogData.category && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-500" />
                  <Badge variant="info">{blogData.category}</Badge>
                </div>
              )}
              
              {blogData.tags && blogData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {blogData.tags.map((tag, index) => (
                    <Badge key={index} variant="default">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Meta Description */}
          {blogData.metaDescription && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">SEO Description</h3>
              <p className="text-sm text-blue-700">{blogData.metaDescription}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Sidebar Ad Placement */}
      {blogData.adSettings?.showAds && blogData.adSettings.adPlacement.includes('sidebar') && (
        <Card className="mt-6 p-4 bg-gray-100 border-2 border-dashed border-gray-300 text-center">
          <p className="text-gray-500 font-medium">Google Ad Placement - Sidebar</p>
          <p className="text-sm text-gray-400">Advertisement will appear in sidebar</p>
        </Card>
      )}
    </div>
  );
};