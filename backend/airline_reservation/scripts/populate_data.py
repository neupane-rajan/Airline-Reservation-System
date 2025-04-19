import os
import django
django.setup()
import random
from decimal import Decimal, ROUND_HALF_UP
from datetime import timedelta

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_reservation.settings')
django.setup()

from flights.models import Airport, Flight
from django.utils import timezone

def create_airports():
    airports_data = [
        {
            'code': 'DEL',
            'name': 'Indira Gandhi International Airport',
            'city': 'Delhi',
            'country': 'India'
        },
        {
            'code': 'MUM',
            'name': 'Chhatrapati Shivaji Maharaj International Airport',
            'city': 'Mumbai',
            'country': 'India'
        },
        {
            'code': 'BLR',
            'name': 'Kempegowda International Airport',
            'city': 'Bangalore',
            'country': 'India'
        },
        {
            'code': 'CHN',
            'name': 'Chennai International Airport',
            'city': 'Chennai',
            'country': 'India'
        },
        {
            'code': 'KOL',
            'name': 'Netaji Subhas Chandra Bose International Airport',
            'city': 'Kolkata',
            'country': 'India'
        }
    ]
    
    created_airports = []
    for airport_data in airports_data:
        airport, _ = Airport.objects.get_or_create(**airport_data)
        created_airports.append(airport)
    
    return created_airports

def create_flights(airports):
    flights_data = []
    for i in range(10):
        # Ensure different departure and arrival airports
        departure = random.choice(airports)
        arrival = random.choice([a for a in airports if a != departure])
        
        # Round price to 2 decimal places
        price = Decimal(random.uniform(3000, 8000)).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        
        departure_time = timezone.now() + timedelta(days=random.randint(1, 30), hours=random.randint(1, 12))
        arrival_time = departure_time + timedelta(hours=random.randint(1, 4))
        
        flight = Flight.objects.create(
            flight_number=f'FL{100 + i}',
            departure_airport=departure,
            arrival_airport=arrival,
            departure_time=departure_time,
            arrival_time=arrival_time,
            capacity=180,
            available_seats=180,
            price=price,
            status='SCHEDULED'
        )
        
        flights_data.append(flight)
    
    return flights_data

def main():
    print("Creating Airports...")
    airports = create_airports()
    print(f"Created {len(airports)} airports")
    
    print("\nCreating Flights...")
    flights = create_flights(airports)
    print(f"Created {len(flights)} flights")

if __name__ == '__main__':
    main()