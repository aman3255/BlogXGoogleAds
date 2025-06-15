import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BlogCard } from '../components/blog/BlogCard';
import { apiService } from '../services/api';
import { Blog } from '../types';
import { BookOpen, PlusCircle, BarChart3, Settings, Edit, Trash2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [userBlogs, setUserBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserBlogs();
    }
  }, [token]);

  const fetchUserBlogs = async () => {
    if (!token) return;
    
    try {
      const response = await apiService.getUserBlogs(token);
      if (response.success && response.data) {
        setUserBlogs(response.data);
      }
    } catch (error) {
      console.error('Error fetching user blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (blogId: string) => {
    if (!token || !confirm('Are you sure you want to delete this blog?')) return;
    
    try {
      const response = await apiService.deleteUserBlog(token, blogId);
      if (response.success) {
        setUserBlogs(prev => prev.filter(blog => blog.id !== blogId));
      }
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const publishedBlogs = userBlogs.filter(blog => blog.status === 'published');
  const draftBlogs = userBlogs.filter(blog => blog.status === 'draft');
  const totalViews = userBlogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalLikes = userBlogs.reduce((sum, blog) => sum + (blog.likes || 0), 0);

  const quickActions = [
    {
      icon: PlusCircle,
      title: 'Write New Blog',
      description: 'Create and publish a new blog post',
      link: '/create-blog',
      color: 'blue',
    },
    {
      icon: BookOpen,
      title: 'View All Blogs',
      description: 'Browse all published blogs',
      link: '/blogs',
      color: 'green',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'View your blog performance',
      action: () => console.log('Analytics coming soon'),
      color: 'purple',
    },
    {
      icon: Settings,
      title: 'Settings',
      description: 'Manage your account settings',
      action: () => console.log('Settings coming soon'),
      color: 'gray',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-gray-600">
          Ready to create something amazing today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-2xl font-bold text-gray-900">{userBlogs.length}</p>
            </div>
            <BookOpen className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{publishedBlogs.length}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Likes</p>
              <p className="text-2xl font-bold text-gray-900">{totalLikes}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 text-red-600">♥</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={action.link ? undefined : action.action}
            >
              {action.link ? (
                <Link to={action.link} className="block">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                        <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-1">
                        {action.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 bg-${action.color}-100 rounded-lg flex items-center justify-center`}>
                      <action.icon className={`w-6 h-6 text-${action.color}-600`} />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-xs text-gray-600">
                      {action.description}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* My Blogs */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">My Blogs</h2>
          <Link to="/create-blog">
            <Button>
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Blog
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </Card>
            ))}
          </div>
        ) : userBlogs.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-4">
              Start writing your first blog to see it here
            </p>
            <Link to="/create-blog">
              <Button>
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Your First Blog
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Draft Blogs */}
            {draftBlogs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Drafts ({draftBlogs.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {draftBlogs.map((blog) => (
                    <div key={blog.id} className="relative">
                      <BlogCard blog={blog} />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Published Blogs */}
            {publishedBlogs.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Published ({publishedBlogs.length})</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {publishedBlogs.map((blog) => (
                    <div key={blog.id} className="relative">
                      <BlogCard blog={blog} />
                      <div className="absolute top-4 right-4 flex space-x-2">
                        <Button size="sm" variant="ghost" className="bg-white/90 hover:bg-white">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="bg-white/90 hover:bg-white text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteBlog(blog.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};