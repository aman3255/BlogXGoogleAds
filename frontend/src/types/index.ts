export interface User {
  id: string;
  username: string;
  fullName: string;
  role: 'user' | 'admin';
  email?: string;
  createdAt: string;
  lastLogin?: string;
  loginAttempts?: number;
  isActive?: boolean;
}

export interface AdSettings {
  showAds: boolean;
  adPlacement: ('top' | 'middle' | 'bottom' | 'sidebar')[];
}

export interface Blog {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  photo?: string;
  author: {
    id: string;
    username: string;
    fullName: string;
  };
  category?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  readTime?: number;
  featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  views?: number;
  likes?: number;
  metaDescription?: string;
  adSettings?: AdSettings;
}

export interface AdminStats {
  totalBlogs: number;
  totalUsers: number;
  totalViews: number;
  recentLogins: number;
  blogsByStatus: {
    published: number;
    draft: number;
    archived: number;
  };
  userActivity: {
    activeUsers: number;
    newUsersThisMonth: number;
  };
}

export interface LoginStatistic {
  id: string;
  userId: string;
  username: string;
  fullName: string;
  lastLogin: string;
  loginAttempts: number;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface SignupData {
  username: string;
  fullName: string;
  password: string;
}

export interface SigninData {
  username: string;
  password: string;
}

export interface CreateBlogData {
  title: string;
  content: string;
  excerpt?: string;
  photo?: string;
  category?: string;
  tags?: string[];
  featured?: boolean;
  status: 'draft' | 'published';
  metaDescription?: string;
  adSettings?: AdSettings;
}

export interface UpdateBlogData extends Partial<CreateBlogData> {
  id: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}