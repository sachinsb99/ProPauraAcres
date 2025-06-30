// lib/api.ts - Updated API service with correct routes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface User {
  id: number;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any;
}

export interface ProfileUpdateData {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    
    // Initialize token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      // Handle different error formats
      const errorMessage = data.message || data.error || `HTTP ${response.status}: ${response.statusText}`;
      throw new Error(errorMessage);
    }

    return data;
  }

  // Authentication methods
  setAuthToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  removeAuthToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  // Auth API calls - Updated to match your Laravel routes
    async login(credentials: { email: string; password: string }): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  }

  async logout(): Promise<ApiResponse> {
    try {
      const response = await this.request<ApiResponse>('/auth/logout', {
        method: 'POST',
      });
      return response;
    } catch (error) {
      // Even if logout fails on server, we still want to clear local token
      console.error('Logout API error:', error);
      throw error;
    } finally {
      // Always remove token locally
      this.removeAuthToken();
    }
  }

  // Profile methods - Updated to match your Laravel routes
  async getProfile(): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/profile');
  }

  async updateProfile(data: ProfileUpdateData): Promise<ApiResponse<User>> {
    return this.request<ApiResponse<User>>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Google OAuth methods - Updated to match your Laravel routes
  getGoogleAuthUrl(): string {
    return `${this.baseURL}/auth/google/redirect`;
  }

  async handleGoogleCallback(code: string): Promise<LoginResponse> {
    const response = await this.request<LoginResponse>('/auth/google/callback', {
      method: 'GET',  // Changed to GET as per Laravel route
      body: JSON.stringify({ code }),
    });

    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }

    return response;
  }

  // Properties methods (placeholder for future implementation)
  async getProperties(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/properties');
  }

  async getProperty(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/properties/${id}`);
  }

  async createProperty(data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProperty(id: number, data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProperty(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Categories methods (placeholder for future implementation)
  async getCategories(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/categories');
  }

  async createCategory(data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>('/categories', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCategory(id: number, data: any): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteCategory(id: number): Promise<ApiResponse> {
    return this.request<ApiResponse>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();