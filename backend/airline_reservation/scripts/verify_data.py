import os
import django
import sys

# Set up Django environment
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_reservation.settings')
django.setup()

from flights.models import Airport, Flight
from users.models import CustomUser

def verify_users():
    print("Users:")
    users = CustomUser.objects.all()
    for user in users:
        print(f"- {user.username} (Email: {user.email})")
    print(f"\nTotal Users: {users.count()}")

def verify_airports():
    print("\nAirports:")
    airports = Airport.objects.all()
    for airport in airports:
        print(f"- {airport.name} ({airport.code}) - {airport.city}, {airport.country}")
    print(f"\nTotal Airports: {airports.count()}")

def verify_flights():
    print("\nFlights:")
    flights = Flight.objects.all()
    for flight in flights:
        print(f"- {flight.flight_number}")
        print(f"  From: {flight.departure_airport}")
        print(f"  To: {flight.arrival_airport}")
        print(f"  Departure: {flight.departure_time}")
        print(f"  Arrival: {flight.arrival_time}")
        print(f"  Price: ₹{flight.price}")
        print(f"  Available Seats: {flight.available_seats}/{flight.capacity}")
        print("---")
    print(f"\nTotal Flights: {flights.count()}")

def main():
    verify_users()
    verify_airports()
    verify_flights()

if __name__ == '__main__':
    main()