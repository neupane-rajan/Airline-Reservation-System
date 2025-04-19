#!/usr/bin/env python
import os
import sys
import requests
import json

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Ensure Django settings are configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_reservation.settings')

BASE_URL = 'http://127.0.0.1:8000'

def search_flights(departure=None, arrival=None, start_date=None, end_date=None):
    url = f'{BASE_URL}/api/flights/'
    params = {}
    
    if departure:
        params['departure'] = departure
    if arrival:
        params['arrival'] = arrival
    if start_date:
        params['start_date'] = start_date
    if end_date:
        params['end_date'] = end_date
    
    try:
        response = requests.get(url, params=params)
        
        print(f"\nFlight Search (Params: {params}):")
        print("Status Code:", response.status_code)
        
        flights = response.json()
        print("Total Flights Found:", len(flights))
        
        if flights:
            print("\nFlight Details:")
            for flight in flights:
                print(f"Flight {flight['flight_number']}:")
                print(f"  From: {flight['departure_airport']['name']}")
                print(f"  To: {flight['arrival_airport']['name']}")
                print(f"  Departure: {flight['departure_time']}")
                print(f"  Price: ₹{flight['price']}")
                print("---")
    except requests.exceptions.ConnectionError:
        print("Error: Unable to connect to the server. Ensure the server is running.")
    except Exception as e:
        print("Error parsing flights:", e)

def main():
    print("Starting Flight Search Tests...")
    
    # Search flights from Delhi
    search_flights(departure='DEL')
    
    # Search flights to Mumbai
    search_flights(arrival='MUM')
    
    # Search flights between specific airports
    search_flights(departure='DEL', arrival='MUM')

if __name__ == '__main__':
    main()