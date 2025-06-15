import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, Save, Send, Image, Settings } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Checkbox } from '../components/ui/Checkbox';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { BlogPreview } from '../components/blog/BlogPreview';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { CreateBlogData, AdSettings } from '../types';

export const CreateBlogPage: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CreateBlogData>({
    title: '',
    content: '',
    excerpt: '',
    photo: '',
    category: '',
    tags: [],
    status: 'draft',
    featured: false,
    metaDescription: '',
    adSettings: {
      showAds: false,
      adPlacement: []
    }
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAdSettings, setShowAdSettings] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const categoryOptions = [
    { value: '', label: 'Select a category' },
    { value: 'technology', label: 'Technology' },
    { value: 'lifestyle', label: 'Lifestyle' },
    { value: 'travel', label: 'Travel' },
    { value: 'food', label: 'Food & Cooking' },
    { value: 'health', label: 'Health & Fitness' },
    { value: 'business', label: 'Business' },
    { value: 'education', label: 'Education' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'science', label: 'Science' },
    { value: 'politics', label: 'Politics' },
    { value: 'art', label: 'Art & Culture' },
  ];

  const adPlacementOptions = [
    { value: 'top', label: 'Top of Article' },
    { value: 'middle', label: 'Middle of Article' },
    { value: 'bottom', label: 'Bottom of Article' },
    { value: 'sidebar', label: 'Sidebar' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleAdSettingsChange = (settings: Partial<AdSettings>) => {
    setFormData(prev => ({
      ...prev,
      adSettings: { ...prev.adSettings!, ...settings }
    }));
  };

  const handleAdPlacementChange = (placement: string, checked: boolean) => {
    const currentPlacements = formData.adSettings?.adPlacement || [];
    const newPlacements = checked
      ? [...currentPlacements, placement as any]
      : currentPlacements.filter(p => p !== placement);
    
    handleAdSettingsChange({ adPlacement: newPlacements });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const generateExcerpt = () => {
    if (formData.content) {
      const excerpt = formData.content.substring(0, 200) + (formData.content.length > 200 ? '...' : '');
      setFormData(prev => ({ ...prev, excerpt }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters long';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    } else if (formData.content.trim().length < 100) {
      newErrors.content = 'Content must be at least 100 characters long';
    }

    if (formData.photo && !isValidUrl(formData.photo)) {
      newErrors.photo = 'Please enter a valid image URL';
    }

    if (formData.metaDescription && formData.metaDescription.length > 160) {
      newErrors.metaDescription = 'Meta description should be under 160 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (status: 'draft' | 'published') => {
    const submitData = { ...formData, status };
    
    if (!validateForm()) return;

    if (!token) {
      setErrors({ submit: 'Authentication required' });
      return;
    }

    setLoading(true);

    try {
      // Auto-generate excerpt if not provided
      if (!submitData.excerpt && submitData.content) {
        submitData.excerpt = submitData.content.substring(0, 200) + (submitData.content.length > 200 ? '...' : '');
      }

      // Ensure all required fields are properly formatted
      const cleanedData: CreateBlogData = {
        title: submitData.title.trim(),
        content: submitData.content.trim(),
        excerpt: submitData.excerpt?.trim() || '',
        photo: submitData.photo?.trim() || '',
        category: submitData.category?.trim() || '',
        tags: submitData.tags?.filter(tag => tag.trim()) || [],
        status: submitData.status,
        featured: Boolean(submitData.featured),
        metaDescription: submitData.metaDescription?.trim() || '',
        adSettings: {
          showAds: Boolean(submitData.adSettings?.showAds),
          adPlacement: submitData.adSettings?.adPlacement || []
        }
      };

      console.log('Submitting blog data:', cleanedData);

      const response = await apiService.createBlog(token, cleanedData);

      if (response.success && response.data) {
        navigate('/dashboard', { 
          state: { 
            message: `Blog ${status === 'published' ? 'published' : 'saved as draft'} successfully!` 
          }
        });
      } else {
        console.error('Blog creation failed:', response.error);
        setErrors({ submit: response.error || 'Failed to create blog' });
      }
    } catch (error) {
      console.error('Network error:', error);
      setErrors({ submit: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please sign in to create a blog</p>
          <Link to="/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Blog</h1>
              <p className="text-gray-600">Share your story with the world</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
              disabled={!formData.title || !formData.content}
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => handleSubmit('draft')}
              loading={loading}
            >
              <Save className="w-4 h-4 mr-2" />
              Save Draft
            </Button>
            
            <Button
              onClick={() => handleSubmit('published')}
              loading={loading}
            >
              <Send className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Blog Content</h2>
              
              <div className="space-y-6">
                <Input
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  error={errors.title}
                  placeholder="Enter an engaging title for your blog (minimum 5 characters)"
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Featured Image URL (Optional)
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      name="photo"
                      value={formData.photo}
                      onChange={handleInputChange}
                      error={errors.photo}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" className="px-3">
                      <Image className="w-4 h-4" />
                    </Button>
                  </div>
                  {formData.photo && (
                    <div className="mt-3">
                      <img 
                        src={formData.photo} 
                        alt="Preview" 
                        className="w-full h-48 object-cover rounded-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>

                <Textarea
                  label="Content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  error={errors.content}
                  placeholder="Write your blog content here... (minimum 100 characters)"
                  rows={15}
                  required
                />

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Excerpt (Optional)
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={generateExcerpt}
                      disabled={!formData.content}
                    >
                      Auto-generate
                    </Button>
                  </div>
                  <Textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief description of your blog post (will be auto-generated if left empty)"
                    rows={3}
                  />
                </div>

                <Input
                  label="Meta Description (SEO)"
                  name="metaDescription"
                  value={formData.metaDescription}
                  onChange={handleInputChange}
                  error={errors.metaDescription}
                  placeholder="SEO description for search engines (max 160 characters)"
                  maxLength={160}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Publishing Options */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Publishing</h3>
              
              <div className="space-y-4">
                <Select
                  label="Category"
                  options={categoryOptions}
                  value={formData.category || ''}
                  onChange={(value) => handleSelectChange('category', value)}
                  placeholder="Select a category"
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagInputKeyPress}
                      placeholder="Add a tag"
                      className="flex-1"
                    />
                    <Button variant="outline" size="sm" onClick={addTag}>
                      Add
                    </Button>
                  </div>
                  
                  {formData.tags && formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <Checkbox
                  label="Featured Blog"
                  checked={formData.featured || false}
                  onChange={(checked) => handleCheckboxChange('featured', checked)}
                />
              </div>
            </Card>

            {/* Ad Settings */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ad Settings</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdSettings(true)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <Checkbox
                  label="Show Ads on this blog"
                  checked={formData.adSettings?.showAds || false}
                  onChange={(checked) => handleAdSettingsChange({ showAds: checked })}
                />

                {formData.adSettings?.showAds && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Ad Placements
                    </label>
                    <div className="space-y-2">
                      {adPlacementOptions.map((option) => (
                        <Checkbox
                          key={option.value}
                          label={option.label}
                          checked={formData.adSettings?.adPlacement.includes(option.value as any) || false}
                          onChange={(checked) => handleAdPlacementChange(option.value, checked)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Error Display */}
            {errors.submit && (
              <Card className="p-4 bg-red-50 border-red-200">
                <p className="text-red-600 text-sm">{errors.submit}</p>
              </Card>
            )}
          </div>
        </div>

        {/* Preview Modal */}
        <Modal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          title="Blog Preview"
          size="xl"
        >
          <BlogPreview 
            blogData={formData} 
            author={{ fullName: user.fullName, username: user.username }} 
          />
        </Modal>

        {/* Ad Settings Modal */}
        <Modal
          isOpen={showAdSettings}
          onClose={() => setShowAdSettings(false)}
          title="Advanced Ad Settings"
          size="lg"
        >
          <div className="space-y-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Google AdSense Integration</h4>
              <p className="text-sm text-blue-700">
                Configure how ads appear on your blog. Ads will be displayed based on your AdSense settings and placement preferences.
              </p>
            </div>

            <div className="space-y-4">
              <Checkbox
                label="Enable ads for this blog"
                checked={formData.adSettings?.showAds || false}
                onChange={(checked) => handleAdSettingsChange({ showAds: checked })}
              />

              {formData.adSettings?.showAds && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Choose Ad Placements</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {adPlacementOptions.map((option) => (
                      <Checkbox
                        key={option.value}
                        label={option.label}
                        checked={formData.adSettings?.adPlacement.includes(option.value as any) || false}
                        onChange={(checked) => handleAdPlacementChange(option.value, checked)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <Button onClick={() => setShowAdSettings(false)} className="w-full">
                Save Ad Settings
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};