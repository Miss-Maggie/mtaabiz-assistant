const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

interface AuthResponse {
  token: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}

interface ApiError {
  detail?: string;
  non_field_errors?: string[];
  [key: string]: unknown;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('authToken');
      if (token) {
        headers['Authorization'] = `Token ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({}));
      const message = 
        error.detail || 
        error.non_field_errors?.[0] || 
        Object.values(error).flat().join(', ') ||
        'An error occurred';
      throw new Error(message);
    }
    return response.json();
  }

  async login(username: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/login/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async signup(username: string, email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${this.baseUrl}/auth/register/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ username, email, password }),
    });
    return this.handleResponse<AuthResponse>(response);
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/auth/logout/`, {
      method: 'POST',
      headers: this.getHeaders(true),
    });
    if (!response.ok && response.status !== 204) {
      throw new Error('Logout failed');
    }
  }

  async getCurrentUser(): Promise<AuthResponse['user']> {
    const response = await fetch(`${this.baseUrl}/auth/user/`, {
      method: 'GET',
      headers: this.getHeaders(true),
    });
    return this.handleResponse<AuthResponse['user']>(response);
  }
}

export const api = new ApiClient(API_BASE_URL);
export type { AuthResponse, ApiError };
