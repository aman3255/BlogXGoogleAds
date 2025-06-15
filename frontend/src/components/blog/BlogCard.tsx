import React from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { Blog } from '../../types';
import { Card } from '../ui/Card';

interface BlogCardProps {
  blog: Blog;
  featured?: boolean;
}

export const BlogCard: React.FC<BlogCardProps> = ({ blog, featured = false }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Card 
      hover 
      className={`p-6 h-full ${featured ? 'border-blue-200 bg-blue-50/30' : ''}`}
    >
      <div className="flex flex-col h-full">
        {featured && (
          <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3 w-fit">
            Featured
          </div>
        )}
        
        <h3 className={`font-bold mb-3 line-clamp-2 ${featured ? 'text-xl' : 'text-lg'}`}>
          {blog.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
          {blog.excerpt || blog.content.substring(0, 150) + '...'}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <div className="flex items-center space-x-1">
            <User className="w-4 h-4" />
            <span>{blog.author.fullName}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {blog.readTime && (
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime} min read</span>
              </div>
            )}
            
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(blog.createdAt)}</span>
            </div>
          </div>
        </div>
        
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {blog.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};