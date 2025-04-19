import React, { useState } from 'react';
import { toast } from 'react-toastify';
import PageTemplate from '../components/layout/PageTemplate';
import { flightService } from '../services/flightService';
import { bookingService } from '../services/bookingService';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const FlightSearchPage = () => {
  const [searchParams, setSearchParams] = useState({
    departure: '',
    arrival: '',
    date: ''
  });
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const result = await flightService.searchFlights(searchParams);
      setFlights(result);
      
      if (result.length === 0) {
        toast.info('No flights found');
      }
    } catch (error) {
      toast.error('Failed to search flights');
    } finally {
      setLoading(false);
    }
  };

  const handleBookFlight = async (flightId) => {
    try {
      await bookingService.createBooking({ 
        flight: flightId, 
        passengers: 1 
      });
      toast.success('Flight booked successfully');
    } catch (error) {
      toast.error('Failed to book flight');
    }
  };

  return (
    <PageTemplate title="Search Flights">
      {/* Search Form */}
      <form 
        onSubmit={handleSearch} 
        className="bg-white shadow-md rounded-lg p-6 mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Departure Airport"
            name="departure"
            value={searchParams.departure}
            onChange={handleChange}
            placeholder="Enter departure airport code"
            required
          />
          
          <Input
            label="Arrival Airport"
            name="arrival"
            value={searchParams.arrival}
            onChange={handleChange}
            placeholder="Enter arrival airport code"
            required
          />
          
          <Input
            label="Travel Date"
            type="date"
            name="date"
            value={searchParams.date}
            onChange={handleChange}
            required
          />
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="mt-4 w-full"
          disabled={loading}
        >
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
      </form>

      {/* Flight Results */}
      <div className="bg-white shadow-md rounded-lg">
        {loading ? (
          <div className="text-center py-6">
            <p className="text-gray-500">Searching for flights...</p>
          </div>
        ) : flights.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-gray-500">No flights found. Try different search criteria.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-brand-light">
              <tr>
                <th className="p-3 text-left">Flight Number</th>
                <th className="p-3 text-left">Departure</th>
                <th className="p-3 text-left">Arrival</th>
                <th className="p-3 text-left">Departure Time</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => (
                <tr key={flight.id} className="border-b">
                  <td className="p-3">{flight.flight_number}</td>
                  <td className="p-3">
                    {flight.departure_airport.name} ({flight.departure_airport.code})
                  </td>
                  <td className="p-3">
                    {flight.arrival_airport.name} ({flight.arrival_airport.code})
                  </td>
                  <td className="p-3">
                    {new Date(flight.departure_time).toLocaleString()}
                  </td>
                  <td className="p-3">₹{flight.price}</td>
                  <td className="p-3">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBookFlight(flight.id)}
                    >
                      Book
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </PageTemplate>
  );
};

export default FlightSearchPage;