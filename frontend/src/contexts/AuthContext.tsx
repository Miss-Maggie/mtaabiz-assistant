import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, AuthResponse } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('authToken')
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const userData = await api.getCurrentUser();
          if (userData) {
            setUser(userData);
          }
        } catch {
          // Token invalid, clear it
          localStorage.removeItem('authToken');
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (username: string, password: string) => {
    const response = await api.login(username, password);
    localStorage.setItem('authToken', response.token);
    setToken(response.token);
    if (response.user) {
      setUser(response.user);
    } else {
      const userData = await api.getCurrentUser();
      if (userData) setUser(userData);
    }
  };

  const signup = async (username: string, email: string, password: string) => {
    const response = await api.signup(username, email, password);
    localStorage.setItem('authToken', response.token);
    setToken(response.token);
    if (response.user) {
      setUser(response.user);
    } else {
      const userData = await api.getCurrentUser();
      if (userData) setUser(userData);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Continue with local logout even if API fails
    }
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!token && !!user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
