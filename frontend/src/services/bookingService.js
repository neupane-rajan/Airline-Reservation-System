import axiosInstance from '../utils/axiosConfig';

export const bookingService = {
  async getUserBookings() {
    try {
      const response = await axiosInstance.get('/bookings/');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch bookings', error);
      throw error;
    }
  },

  async createBooking(bookingData) {
    try {
      const response = await axiosInstance.post('/bookings/', bookingData);
      return response.data;
    } catch (error) {
      console.error('Failed to create booking', error);
      throw error;
    }
  },

  async cancelBooking(bookingId) {
    try {
      const response = await axiosInstance.post(`/bookings/${bookingId}/cancel/`);
      return response.data;
    } catch (error) {
      console.error('Failed to cancel booking', error);
      throw error;
    }
  }
};