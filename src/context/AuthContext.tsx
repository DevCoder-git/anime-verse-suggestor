
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { loginUser, logoutUser, fetchUserProfile } from '@/services/api';
import { UserProfile } from '@/services/types';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserData: (userData: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user is already logged in on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await fetchUserProfile();
          setUser(userData);
          setIsAuthenticated(true);
        } catch (err) {
          localStorage.removeItem('token');
          setError('Session expired. Please login again.');
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      await loginUser(username, password);
      const userData = await fetchUserProfile();
      setUser(userData);
      setIsAuthenticated(true);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${userData.username}!`,
      });
    } catch (err) {
      setError('Invalid username or password');
      toast({
        title: "Login Failed",
        description: "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setIsAuthenticated(false);
    toast({
      title: "Logged Out",
      description: "You've been successfully logged out",
    });
  };

  const updateUserData = (userData: UserProfile) => {
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, error, login, logout, updateUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
