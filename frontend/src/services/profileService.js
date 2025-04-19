import axiosInstance from '../utils/axiosConfig';

export const profileService = {
  async getUserProfile() {
    try {
      const response = await axiosInstance.get('/user/profile/');
      return response.data;
    } catch (error) {
      console.error('Profile fetch error', error);
      throw error;
    }
  },

  async updateProfile(profileData) {
    try {
      const response = await axiosInstance.put('/user/profile/', profileData);
      return response.data;
    } catch (error) {
      console.error('Profile update error', error);
      throw error;
    }
  }
};