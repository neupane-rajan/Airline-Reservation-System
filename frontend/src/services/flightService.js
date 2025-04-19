import axiosInstance from '../utils/axiosConfig';

export const flightService = {
  async searchFlights(params) {
    try {
      const response = await axiosInstance.get('/flights/', { params });
      return response.data;
    } catch (error) {
      console.error('Flight search error', error);
      throw error;
    }
  },

  async getFlightDetails(flightId) {
    try {
      const response = await axiosInstance.get(`/flights/${flightId}/`);
      return response.data;
    } catch (error) {
      console.error('Flight details error', error);
      throw error;
    }
  }
};