import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';

// Create the AuthContext
const AuthContext = createContext(null);

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication on initial load
  useEffect(() => {
    checkAuthentication();
  }, []);

  // Authentication check method
  const checkAuthentication = async () => {
    const token = localStorage.getItem('token');
    
    setLoading(true);
    
    if (token) {
      try {
        // Validate token and get user info
        const userData = await authService.validateToken();
        
        setUser(userData);
        setIsAuthenticated(true);
        navigate('/dashboard');
      } catch (error) {
        // Token is invalid or expired
        console.error('Authentication check failed:', error);
        logout();
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      navigate('/login');
    }
  };

  // Login method
  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user, access } = response;

      // Store token
      localStorage.setItem('token', access);
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      // Show success message
      toast.success('Login Successful');
      
      // Navigate to dashboard
      navigate('/dashboard');
      
      return user;
    } catch (error) {
      // Handle login error
      const errorMessage = error.response?.data?.detail || 'Login failed';
      toast.error(errorMessage);
      
      // Clear any existing token
      localStorage.removeItem('token');
      
      throw error;
    }
  };

  // Registration method
  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Automatically log in after registration
      await login({
        username: userData.username,
        password: userData.password
      });
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Registration failed';
      toast.error(errorMessage);
      
      // Clear any existing token
      localStorage.removeItem('token');
      
      throw error;
    }
  };

  // Logout method
  const logout = () => {
    // Remove token
    localStorage.removeItem('token');
    
    // Reset state
    setUser(null);
    setIsAuthenticated(false);
    
    // Navigate to login
    navigate('/login');
    
    // Show logout message
    toast.info('Logged out successfully');
  };

  // Loading state component
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-brand-blue"></div>
      </div>
    );
  }

  // Provide the context value
  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};