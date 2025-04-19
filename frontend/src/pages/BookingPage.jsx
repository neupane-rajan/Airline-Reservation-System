import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import PageTemplate from '../components/layout/PageTemplate';
import { bookingService } from '../services/bookingService';
import Button from '../components/common/Button';

const BookingPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const bookingData = await bookingService.getUserBookings();
      setBookings(bookingData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch bookings');
      toast.error('Unable to load bookings');
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      
      // Remove cancelled booking from list
      setBookings(prevBookings => 
        prevBookings.filter(booking => booking.id !== bookingId)
      );
    } catch (err) {
      toast.error('Failed to cancel booking');
    }
  };

  // Render booking status badge
  const renderStatusBadge = (status) => {
    const statusColors = {
      'CONFIRMED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'PENDING': 'bg-yellow-100 text-yellow-800'
    };

    return (
      <span className={`
        px-2 py-1 rounded-full text-xs font-bold 
        ${statusColors[status] || 'bg-gray-100 text-gray-800'}
      `}>
        {status}
      </span>
    );
  };

  // Render loading state
  if (loading) {
    return (
      <PageTemplate>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-brand-blue"></div>
        </div>
      </PageTemplate>
    );
  }

  // Render error state
  if (error) {
    return (
      <PageTemplate>
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      </PageTemplate>
    );
  }

  return (
    <PageTemplate>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-brand-blue">
          My Bookings
        </h1>
        
        {bookings.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            <p>You have no bookings yet.</p>
            <Button 
              variant="primary" 
              className="mt-4"
              onClick={() => window.location.href = '/search'}
            >
              Search Flights
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-brand-light">
                  <th className="p-3 text-left">Booking ID</th>
                  <th className="p-3 text-left">Flight</th>
                  <th className="p-3 text-left">Departure</th>
                  <th className="p-3 text-left">Arrival</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Passengers</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{booking.id}</td>
                    <td className="p-3">{booking.flight.flight_number}</td>
                    <td className="p-3">
                      {booking.flight.departure_airport.name}
                    </td>
                    <td className="p-3">
                      {booking.flight.arrival_airport.name}
                    </td>
                    <td className="p-3">
                      {new Date(booking.flight.departure_time).toLocaleDateString()}
                    </td>
                    <td className="p-3">{booking.passengers}</td>
                    <td className="p-3">
                      {renderStatusBadge(booking.status)}
                    </td>
                    <td className="p-3">
                      {booking.status === 'CONFIRMED' && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.id)}
                        >
                          Cancel
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PageTemplate>
  );
};

export default BookingPage;