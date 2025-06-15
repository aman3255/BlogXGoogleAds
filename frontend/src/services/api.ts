import { SignupData, SigninData, ApiResponse, User, Blog, AdminStats, LoginStatistic, CreateBlogData, UpdateBlogData } from '../types';

// Mock data for demonstration
const mockBlogs: Blog[] = [
  {
    id: '1',
    title: 'The Future of Web Development',
    content: 'Exploring the latest trends and technologies shaping the future of web development...',
    excerpt: 'A comprehensive look at emerging web technologies and their impact on modern development.',
    slug: 'future-of-web-development',
    author: {
      id: '1',
      username: 'Sarahjohnson',
      fullName: 'Sarah Johnson',
      // role: 'user'
    },
    category: 'Technology',
    tags: ['web development', 'technology', 'future'],
    status: 'published',
    featured: true,
    photo: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
    // publishedAt: new Date('2024-01-15').toISOString(),
    views: 1250,
    likes: 89,
    metaDescription: 'Discover the future of web development with emerging technologies and trends.',
    adSettings: {
      showAds: true,
      adPlacement: ['top', 'middle']
    }
  },
  {
    id: '2',
    title: 'Mastering React Hooks',
    content: 'A deep dive into React Hooks and how they revolutionize component state management...',
    excerpt: 'Learn how to effectively use React Hooks to build more efficient and maintainable components.',
    slug: 'mastering-react-hooks',
    author: {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      role: 'user'
    },
    category: 'Programming',
    tags: ['react', 'hooks', 'javascript'],
    status: 'published',
    featured: true,
    photo: 'https://images.pexels.com/photos/11035471/pexels-photo-11035471.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-12').toISOString(),
    updatedAt: new Date('2024-01-12').toISOString(),
    publishedAt: new Date('2024-01-12').toISOString(),
    views: 980,
    likes: 67,
    metaDescription: 'Master React Hooks with practical examples and best practices.',
    adSettings: {
      showAds: false,
      adPlacement: []
    }
  },
  {
    id: '3',
    title: 'Design Systems That Scale',
    content: 'Building design systems that grow with your organization and maintain consistency...',
    excerpt: 'Best practices for creating scalable design systems that enhance team productivity.',
    slug: 'design-systems-that-scale',
    author: {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma@example.com',
      role: 'user'
    },
    category: 'Design',
    tags: ['design systems', 'ui/ux', 'scalability'],
    status: 'published',
    featured: true,
    photo: 'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=800',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
    publishedAt: new Date('2024-01-10').toISOString(),
    views: 756,
    likes: 45,
    metaDescription: 'Learn how to build design systems that scale with your organization.',
    adSettings: {
      showAds: true,
      adPlacement: ['bottom']
    }
  }
];

const API_BASE_URL = 'http://localhost:4000/api/v1';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        // Log the full error response for debugging
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: data
        });

        return {
          success: false,
          error: data.message || data.error || 'An error occurred',
        };
      }

      return {
        success: true,
        data: data.data || data,
      };
    } catch (error) {
      console.error('Network Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  private async mockRequest<T>(data: T, delay: number = 500): Promise<ApiResponse<T>> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, delay));
    
    return {
      success: true,
      data: data,
    };
  }

  private getAuthHeaders(token: string) {
    return {
      'Authorization': `Bearer ${token}`,
    };
  }

  // Authentication
  async signup(data: SignupData): Promise<ApiResponse<{ token: string; user: User }>> {
    // Mock signup response
    const mockUser: User = {
      id: 'mock-user-id',
      name: data.name,
      email: data.email,
      role: 'user'
    };

    return this.mockRequest({
      token: 'mock-jwt-token',
      user: mockUser
    });
  }

  async signin(data: SigninData): Promise<ApiResponse<{ token: string; user: User }>> {
    // Mock signin response
    const mockUser: User = {
      id: 'mock-user-id',
      name: 'Demo User',
      email: data.email,
      role: 'user'
    };

    return this.mockRequest({
      token: 'mock-jwt-token',
      user: mockUser
    });
  }

  // Public Blog endpoints
  async getBlogs(token?: string): Promise<ApiResponse<Blog[]>> {
    return this.mockRequest(mockBlogs);
  }

  async getBlogBySlug(slug: string): Promise<ApiResponse<Blog>> {
    const blog = mockBlogs.find(b => b.slug === slug);
    if (blog) {
      return this.mockRequest(blog);
    } else {
      return {
        success: false,
        error: 'Blog not found'
      };
    }
  }

  async getFeaturedBlogs(): Promise<ApiResponse<Blog[]>> {
    const featuredBlogs = mockBlogs.filter(blog => blog.featured);
    return this.mockRequest(featuredBlogs);
  }

  // User Blog endpoints
  async createBlog(token: string, data: CreateBlogData): Promise<ApiResponse<Blog>> {
    // Clean and format the data before sending
    const cleanData = {
      title: data.title?.trim() || '',
      content: data.content?.trim() || '',
      excerpt: data.excerpt?.trim() || undefined,
      photo: data.photo?.trim() || undefined,
      category: data.category?.trim() || undefined,
      tags: Array.isArray(data.tags) ? data.tags.filter(tag => tag.trim()) : [],
      status: data.status || 'draft',
      featured: Boolean(data.featured),
      metaDescription: data.metaDescription?.trim() || undefined,
      adSettings: data.adSettings ? {
        showAds: Boolean(data.adSettings.showAds),
        adPlacement: Array.isArray(data.adSettings.adPlacement) ? data.adSettings.adPlacement : []
      } : {
        showAds: false,
        adPlacement: []
      }
    };

    // Remove undefined values to avoid sending them
    Object.keys(cleanData).forEach(key => {
      if (cleanData[key as keyof typeof cleanData] === undefined) {
        delete cleanData[key as keyof typeof cleanData];
      }
    });

    console.log('Sending blog data:', cleanData);

    // Mock create blog response
    const newBlog: Blog = {
      id: Date.now().toString(),
      ...cleanData,
      slug: cleanData.title.toLowerCase().replace(/\s+/g, '-'),
      author: {
        id: 'mock-user-id',
        name: 'Demo User',
        email: 'demo@example.com',
        role: 'user'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: cleanData.status === 'published' ? new Date().toISOString() : undefined,
      views: 0,
      likes: 0
    };

    return this.mockRequest(newBlog);
  }

  async getUserBlogs(token: string): Promise<ApiResponse<Blog[]>> {
    // Return user's blogs (mock data)
    return this.mockRequest(mockBlogs.slice(0, 2));
  }

  async updateUserBlog(token: string, data: UpdateBlogData): Promise<ApiResponse<Blog>> {
    const existingBlog = mockBlogs.find(b => b.id === data.id);
    if (existingBlog) {
      const updatedBlog = { ...existingBlog, ...data, updatedAt: new Date().toISOString() };
      return this.mockRequest(updatedBlog);
    } else {
      return {
        success: false,
        error: 'Blog not found'
      };
    }
  }

  async deleteUserBlog(token: string, blogId: string): Promise<ApiResponse<void>> {
    return this.mockRequest(undefined as any);
  }

  // Admin endpoints
  async getAdminStats(token: string): Promise<ApiResponse<AdminStats>> {
    const mockStats: AdminStats = {
      totalUsers: 2500,
      totalBlogs: 10000,
      totalViews: 1250000,
      totalLikes: 89000,
      recentSignups: 150,
      publishedBlogs: 8500,
      draftBlogs: 1500,
      featuredBlogs: 25
    };

    return this.mockRequest(mockStats);
  }

  async getLoginStatistics(token: string): Promise<ApiResponse<LoginStatistic[]>> {
    const mockStats: LoginStatistic[] = [
      { date: '2024-01-01', count: 45 },
      { date: '2024-01-02', count: 52 },
      { date: '2024-01-03', count: 38 },
      { date: '2024-01-04', count: 67 },
      { date: '2024-01-05', count: 71 },
      { date: '2024-01-06', count: 59 },
      { date: '2024-01-07', count: 43 }
    ];

    return this.mockRequest(mockStats);
  }

  async getAllBlogs(token: string): Promise<ApiResponse<Blog[]>> {
    return this.mockRequest(mockBlogs);
  }

  async updateBlog(token: string, data: UpdateBlogData): Promise<ApiResponse<Blog>> {
    const existingBlog = mockBlogs.find(b => b.id === data.id);
    if (existingBlog) {
      const updatedBlog = { ...existingBlog, ...data, updatedAt: new Date().toISOString() };
      return this.mockRequest(updatedBlog);
    } else {
      return {
        success: false,
        error: 'Blog not found'
      };
    }
  }

  async deleteBlog(token: string, blogId: string): Promise<ApiResponse<void>> {
    return this.mockRequest(undefined as any);
  }

  async archiveBlog(token: string, blogId: string): Promise<ApiResponse<Blog>> {
    const existingBlog = mockBlogs.find(b => b.id === blogId);
    if (existingBlog) {
      const archivedBlog = { ...existingBlog, status: 'archived' as const, updatedAt: new Date().toISOString() };
      return this.mockRequest(archivedBlog);
    } else {
      return {
        success: false,
        error: 'Blog not found'
      };
    }
  }

  async toggleFeaturedBlog(token: string, blogId: string): Promise<ApiResponse<Blog>> {
    const existingBlog = mockBlogs.find(b => b.id === blogId);
    if (existingBlog) {
      const updatedBlog = { ...existingBlog, featured: !existingBlog.featured, updatedAt: new Date().toISOString() };
      return this.mockRequest(updatedBlog);
    } else {
      return {
        success: false,
        error: 'Blog not found'
      };
    }
  }

  async getAllUsers(token: string): Promise<ApiResponse<User[]>> {
    const mockUsers: User[] = [
      { id: '1', name: 'Sarah Johnson', email: 'sarah@example.com', role: 'user' },
      { id: '2', name: 'Michael Chen', email: 'michael@example.com', role: 'user' },
      { id: '3', name: 'Emma Rodriguez', email: 'emma@example.com', role: 'user' },
      { id: '4', name: 'Admin User', email: 'admin@example.com', role: 'admin' }
    ];

    return this.mockRequest(mockUsers);
  }
}

export const apiService = new ApiService();