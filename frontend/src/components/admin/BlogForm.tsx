import React, { useState, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { CreateBlogData, UpdateBlogData, Blog } from '../../types';

interface BlogFormProps {
  blog?: Blog;
  onSubmit: (data: CreateBlogData | UpdateBlogData) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const BlogForm: React.FC<BlogFormProps> = ({
  blog,
  onSubmit,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featured: false,
    status: 'draft' as 'draft' | 'published'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt || '',
        category: blog.category || '',
        tags: blog.tags?.join(', ') || '',
        featured: blog.featured || false,
        status: blog.status
      });
    }
  }, [blog]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (formData.content.length < 50) {
      newErrors.content = 'Content must be at least 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const submitData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      excerpt: formData.excerpt.trim() || undefined,
      category: formData.category.trim() || undefined,
      tags: tags.length > 0 ? tags : undefined,
      featured: formData.featured,
      status: formData.status,
      ...(blog && { id: blog.id })
    };

    await onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        error={errors.title}
        placeholder="Enter blog title"
        required
      />

      <Textarea
        label="Content"
        name="content"
        value={formData.content}
        onChange={handleInputChange}
        error={errors.content}
        placeholder="Write your blog content here..."
        rows={12}
        required
      />

      <Textarea
        label="Excerpt (Optional)"
        name="excerpt"
        value={formData.excerpt}
        onChange={handleInputChange}
        error={errors.excerpt}
        placeholder="Brief description of the blog post"
        rows={3}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Category (Optional)"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          placeholder="e.g., Technology, Lifestyle"
        />

        <Input
          label="Tags (Optional)"
          name="tags"
          value={formData.tags}
          onChange={handleInputChange}
          placeholder="Separate tags with commas"
        />
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            checked={formData.featured}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
            Featured Blog
          </label>
        </div>

        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Status:</label>
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="draft"
                checked={formData.status === 'draft'}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Draft</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="status"
                value="published"
                checked={formData.status === 'published'}
                onChange={handleInputChange}
                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Published</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-6 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          loading={loading}
        >
          {blog ? 'Update Blog' : 'Create Blog'}
        </Button>
      </div>
    </form>
  );
};