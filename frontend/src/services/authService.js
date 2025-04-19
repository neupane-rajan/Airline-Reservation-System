import axiosInstance from '../utils/axiosConfig';

export const authService = {
  async login(credentials) {
    try {
      const response = await axiosInstance.post('/token/', credentials);
      return {
        user: {
          username: response.data.username,
          // Add other user fields from backend response
          email: response.data.email // Add fields as per your backend response
        },
        access: response.data.access
      };
    } catch (error) {
      console.error('Login error', error.response?.data);
      throw error;
    }
  },

  async register(userData) {
    try {
      const response = await axiosInstance.post('/register/', userData);
      return response.data;
    } catch (error) {
      console.error('Registration error', error.response?.data);
      throw error;
    }
  },

  async validateToken() {
    try {
      // Modify this endpoint based on your actual backend user profile endpoint
      const response = await axiosInstance.get('/users/me/'); // Adjust this endpoint
      return response.data;
    } catch (error) {
      console.error('Token validation failed', error);
      throw error;
    }
  }
};