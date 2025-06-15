import React, { useState, useEffect } from 'react';
import { Users, Clock, Shield, Activity } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { apiService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { LoginStatistic } from '../../types';

export const LoginStatistics: React.FC = () => {
  const { token } = useAuth();
  const [loginStats, setLoginStats] = useState<LoginStatistic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLoginStatistics();
  }, []);

  const fetchLoginStatistics = async () => {
    if (!token) return;
    
    try {
      const response = await apiService.getLoginStatistics(token);
      if (response.success && response.data) {
        setLoginStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching login statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getActivityStatus = (lastLogin: string, isActive: boolean) => {
    if (!isActive) return <Badge variant="error">Inactive</Badge>;
    
    const date = new Date(lastLogin);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays <= 1) {
      return <Badge variant="success">Very Active</Badge>;
    } else if (diffInDays <= 7) {
      return <Badge variant="info">Active</Badge>;
    } else if (diffInDays <= 30) {
      return <Badge variant="warning">Moderate</Badge>;
    } else {
      return <Badge variant="error">Inactive</Badge>;
    }
  };

  const getLoginAttemptsStatus = (attempts: number) => {
    if (attempts <= 3) {
      return <Badge variant="success">{attempts} attempts</Badge>;
    } else if (attempts <= 10) {
      return <Badge variant="warning">{attempts} attempts</Badge>;
    } else {
      return <Badge variant="error">{attempts} attempts</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Login Statistics</h2>
        <p className="text-gray-600">Monitor user login activity and security metrics</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{loginStats.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {loginStats.filter(stat => stat.isActive).length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recent Logins</p>
              <p className="text-2xl font-bold text-gray-900">
                {loginStats.filter(stat => {
                  const diffInHours = Math.floor((new Date().getTime() - new Date(stat.lastLogin).getTime()) / (1000 * 60 * 60));
                  return diffInHours <= 24;
                }).length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Attempts</p>
              <p className="text-2xl font-bold text-gray-900">
                {loginStats.filter(stat => stat.loginAttempts > 10).length}
              </p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </Card>
      </div>

      {/* User Statistics Table */}
      <Card className="overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Login Details</h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Login Attempts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loginStats.map((stat) => (
                <tr key={stat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {stat.fullName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {stat.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          @{stat.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatLastLogin(stat.lastLogin)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(stat.lastLogin).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLoginAttemptsStatus(stat.loginAttempts)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getActivityStatus(stat.lastLogin, stat.isActive)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {stat.ipAddress || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {loginStats.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No login statistics available</p>
          </div>
        )}
      </Card>
    </div>
  );
};