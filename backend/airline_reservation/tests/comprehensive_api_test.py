#!/usr/bin/env python
import os
import sys
import requests
import json
import uuid

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Ensure Django settings are configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'airline_reservation.settings')

BASE_URL = 'http://127.0.0.1:8000'

def generate_unique_username():
    return f"testuser_{uuid.uuid4().hex[:8]}"

def test_welcome():
    url = f'{BASE_URL}/'
    response = requests.get(url)
    print("Welcome Endpoint:")
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
    return response

def test_user_registration():
    url = f'{BASE_URL}/api/register/'
    unique_username = generate_unique_username()
    data = {
        "username": unique_username,
        "email": f"{unique_username}@example.com",
        "password": "NewUser2024!"
    }
    
    response = requests.post(url, json=data)
    print("\nUser Registration:")
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
    return response, data

def test_token_obtain(username, password):
    url = f'{BASE_URL}/api/token/'
    data = {
        "username": username,
        "password": password
    }
    
    response = requests.post(url, json=data)
    print("\nToken Obtain:")
    print("Status Code:", response.status_code)
    print("Response:", json.dumps(response.json(), indent=2))
    return response

def test_flights():
    url = f'{BASE_URL}/api/flights/'
    response = requests.get(url)
    print("\nFlights Listing:")
    print("Status Code:", response.status_code)
    
    try:
        flights = response.json()
        print("Total Flights:", len(flights))
        print("First Flight Details:" if flights else "No Flights")
        if flights:
            print(json.dumps(flights[0], indent=2))
    except Exception as e:
        print("Error parsing flights:", e)
        print("Response Content:", response.text)

def test_airports():
    url = f'{BASE_URL}/api/airports/'
    response = requests.get(url)
    print("\nAirports Listing:")
    print("Status Code:", response.status_code)
    
    try:
        airports = response.json()
        print("Total Airports:", len(airports))
        print("First Airport Details:" if airports else "No Airports")
        if airports:
            print(json.dumps(airports[0], indent=2))
    except Exception as e:
        print("Error parsing airports:", e)
        print("Response Content:", response.text)

def test_flight_search():
    # Test flight search by departure airport
    url = f'{BASE_URL}/api/flights/?departure=DEL'
    response = requests.get(url)
    print("\nFlights from Delhi:")
    print("Status Code:", response.status_code)
    
    try:
        flights = response.json()
        print("Total Flights from Delhi:", len(flights))
        if flights:
            print("First Flight Details:")
            print(json.dumps(flights[0], indent=2))
    except Exception as e:
        print("Error parsing flights:", e)
        print("Response Content:", response.text)

def main():
    print("Starting Comprehensive API Testing...")
    
    # Test Welcome Endpoint
    welcome_response = test_welcome()
    
    # Test User Registration
    registration_response, user_data = test_user_registration()
    
    # Test Token Obtain
    token_response = test_token_obtain(
        username=user_data['username'], 
        password=user_data['password']
    )
    
    # Test Flights Listing
    test_flights()
    
    # Test Airports Listing
    test_airports()
    
    # Test Flight Search
    test_flight_search()

if __name__ == '__main__':
    main()