import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Archive, Star, Eye, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { BlogForm } from './BlogForm';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { Blog, CreateBlogData, UpdateBlogData } from '../../types';

export const BlogManagement: React.FC = () => {
  const { token } = useAuth();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    if (!token) return;
    
    try {
      const response = await apiService.getAllBlogs(token);
      if (response.success && response.data) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlog = async (data: CreateBlogData) => {
    if (!token) return;
    
    setActionLoading('create');
    try {
      const response = await apiService.createBlog(token, data);
      if (response.success && response.data) {
        setBlogs(prev => [response.data!, ...prev]);
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUpdateBlog = async (data: UpdateBlogData) => {
    if (!token) return;
    
    setActionLoading('update');
    try {
      const response = await apiService.updateBlog(token, data);
      if (response.success && response.data) {
        setBlogs(prev => prev.map(blog => 
          blog.id === data.id ? response.data! : blog
        ));
        setShowEditModal(false);
        setSelectedBlog(null);
      }
    } catch (error) {
      console.error('Error updating blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!token || !confirm('Are you sure you want to delete this blog?')) return;
    
    setActionLoading(blogId);
    try {
      const response = await apiService.deleteBlog(token, blogId);
      if (response.success) {
        setBlogs(prev => prev.filter(blog => blog.id !== blogId));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleArchiveBlog = async (blogId: string) => {
    if (!token) return;
    
    setActionLoading(blogId);
    try {
      const response = await apiService.archiveBlog(token, blogId);
      if (response.success && response.data) {
        setBlogs(prev => prev.map(blog => 
          blog.id === blogId ? response.data! : blog
        ));
      }
    } catch (error) {
      console.error('Error archiving blog:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleFeatured = async (blogId: string) => {
    if (!token) return;
    
    setActionLoading(blogId);
    try {
      const response = await apiService.toggleFeaturedBlog(token, blogId);
      if (response.success && response.data) {
        setBlogs(prev => prev.map(blog => 
          blog.id === blogId ? response.data! : blog
        ));
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="warning">Draft</Badge>;
      case 'archived':
        return <Badge variant="error">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-3 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Blog Management</h2>
          <p className="text-gray-600">Create, edit, and manage all blog posts</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create New Blog
        </Button>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-4">Get started by creating your first blog post</p>
            <Button onClick={() => setShowCreateModal(true)}>
              Create New Blog
            </Button>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {blog.title}
                    </h3>
                    {blog.featured && (
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    )}
                    {getStatusBadge(blog.status)}
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {blog.excerpt || blog.content.substring(0, 150) + '...'}
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Created {formatDate(blog.createdAt)}</span>
                    </div>
                    
                    {blog.views && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{blog.views} views</span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-1">
                      <span>By {blog.author.fullName}</span>
                    </div>
                  </div>
                  
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {blog.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} size="sm">
                          {tag}
                        </Badge>
                      ))}
                      {blog.tags.length > 3 && (
                        <Badge size="sm" variant="info">
                          +{blog.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleFeatured(blog.id)}
                    loading={actionLoading === blog.id}
                    title={blog.featured ? 'Remove from featured' : 'Mark as featured'}
                  >
                    <Star className={`w-4 h-4 ${blog.featured ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedBlog(blog);
                      setShowEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  
                  {blog.status !== 'archived' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleArchiveBlog(blog.id)}
                      loading={actionLoading === blog.id}
                    >
                      <Archive className="w-4 h-4" />
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteBlog(blog.id)}
                    loading={actionLoading === blog.id}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Create Blog Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Blog"
        size="xl"
      >
        <BlogForm
          onSubmit={handleCreateBlog}
          onCancel={() => setShowCreateModal(false)}
          loading={actionLoading === 'create'}
        />
      </Modal>

      {/* Edit Blog Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedBlog(null);
        }}
        title="Edit Blog"
        size="xl"
      >
        {selectedBlog && (
          <BlogForm
            blog={selectedBlog}
            onSubmit={handleUpdateBlog}
            onCancel={() => {
              setShowEditModal(false);
              setSelectedBlog(null);
            }}
            loading={actionLoading === 'update'}
          />
        )}
      </Modal>
    </div>
  );
};