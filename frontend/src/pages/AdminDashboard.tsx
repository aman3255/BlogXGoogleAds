import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Eye, 
  TrendingUp, 
  Calendar,
  Settings,
  FileText,
  Activity
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BlogManagement } from '../components/admin/BlogManagement';
import { LoginStatistics } from '../components/admin/LoginStatistics';
import { apiService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { AdminStats } from '../types';

type ActiveTab = 'overview' | 'blogs' | 'users' | 'analytics';

export const AdminDashboard: React.FC = () => {
  const { user, token } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    if (!token) return;
    
    try {
      const response = await apiService.getAdminStats(token);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: BarChart3 },
    { id: 'blogs' as ActiveTab, label: 'Blog Management', icon: FileText },
    { id: 'users' as ActiveTab, label: 'User Analytics', icon: Users },
    { id: 'analytics' as ActiveTab, label: 'Performance', icon: TrendingUp },
  ];

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.fullName}!
        </h1>
        <p className="text-blue-100 text-lg">
          Here's what's happening with your blog platform today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Blogs</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.totalBlogs || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{stats?.blogsByStatus.published || 0} published
              </p>
            </div>
            <BookOpen className="w-10 h-10 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.totalUsers || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                +{stats?.userActivity.newUsersThisMonth || 0} this month
              </p>
            </div>
            <Users className="w-10 h-10 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Views</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.totalViews?.toLocaleString() || 0}
              </p>
              <p className="text-sm text-blue-600 mt-1">
                Across all blogs
              </p>
            </div>
            <Eye className="w-10 h-10 text-purple-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-3xl font-bold text-gray-900">
                {loading ? '...' : stats?.userActivity.activeUsers || 0}
              </p>
              <p className="text-sm text-green-600 mt-1">
                Last 30 days
              </p>
            </div>
            <Activity className="w-10 h-10 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Blog Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Blog Status Distribution
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-700">Published</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.blogsByStatus.published || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-700">Draft</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.blogsByStatus.draft || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-700">Archived</span>
              </div>
              <span className="font-semibold text-gray-900">
                {stats?.blogsByStatus.archived || 0}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('blogs')}
            >
              <FileText className="w-4 h-4 mr-2" />
              Manage Blogs
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-4 h-4 mr-2" />
              View User Analytics
            </Button>
            <Button 
              className="w-full justify-start" 
              variant="outline"
              onClick={() => setActiveTab('analytics')}
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Performance Metrics
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 mb-2">Activity tracking coming soon</p>
          <p className="text-sm text-gray-500">
            Monitor user actions, blog updates, and system events
          </p>
        </div>
      </Card>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
        <p className="text-gray-600">Detailed insights and performance metrics</p>
      </div>
      
      <Card className="p-12 text-center">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Advanced Analytics Coming Soon
        </h3>
        <p className="text-gray-600">
          Detailed performance metrics, user engagement analytics, and growth insights will be available here.
        </p>
      </Card>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'blogs' && <BlogManagement />}
        {activeTab === 'users' && <LoginStatistics />}
        {activeTab === 'analytics' && renderAnalytics()}
      </div>
    </div>
  );
};