import { apiGet, apiPost, apiPut, apiDelete } from '../utils/apiIntegration';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: string;
  department?: string;
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
}

export class AuthService {
  private static TOKEN_KEY = 'ems_token';
  private static USER_KEY = 'ems_user';

  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await apiPost<AuthResponse>('/auth/login', credentials);
      
      if (!response.success) {
        throw new Error(response.error || 'Login failed');
      }
      
      const authData = response.data;
      if (authData.token) {
        this.setToken(authData.token);
        this.setUser(authData.user);
      }
      
      return authData;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await apiPost<AuthResponse>('/auth/register', userData);
      
      if (!response.success) {
        throw new Error(response.error || 'Registration failed');
      }
      
      const authData = response.data;
      if (authData.token) {
        this.setToken(authData.token);
        this.setUser(authData.user);
      }
      
      return authData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static setUser(user: any): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  static getAuthHeader(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  static hasRole(requiredRole: string): boolean {
    const user = this.getUser();
    return user && user.role === requiredRole;
  }

  static hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user && roles.includes(user.role);
  }
}