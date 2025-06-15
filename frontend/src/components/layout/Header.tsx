import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, LogOut, Settings, PlusCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

export const Header: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">BlogHub</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/blogs" className="text-gray-600 hover:text-gray-900 transition-colors">
              Blogs
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Dashboard
                </Link>
                <Link to="/create-blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                  Write
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link to="/create-blog">
                  <Button variant="outline" size="sm">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Write
                  </Button>
                </Link>
                
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">
                    {user?.fullName}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {user?.role === 'admin' && (
                    <Link to="/admin/dashboard">
                      <Button variant="ghost" size="sm">
                        <Settings className="w-4 h-4 mr-1" />
                        Admin
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-1" />
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};