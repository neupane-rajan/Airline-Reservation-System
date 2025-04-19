#!/usr/bin/env python
import os
import sys
import requests
import json
import uuid

# Add project root to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

BASE_URL = 'http://127.0.0.1:8000'

def generate_unique_username():
    return f"bookinguser_{uuid.uuid4().hex[:8]}"

def get_access_token(username, password):
    url = f'{BASE_URL}/api/token/'
    response = requests.post(url, json={
        "username": username,
        "password": password
    })
    return response.json()['access']

def test_booking_workflow():
    print("\nBooking Workflow Test:")
    
    try:
        # Register a new user
        unique_username = generate_unique_username()
        register_url = f'{BASE_URL}/api/register/'
        register_data = {
            "username": unique_username,
            "email": f"{unique_username}@example.com",
            "password": "BookingUser2024!"
        }
        register_response = requests.post(register_url, json=register_data)
        print("User Registration:")
        print("Status Code:", register_response.status_code)
        
        # Get access token
        access_token = get_access_token(
            unique_username, 
            "BookingUser2024!"
        )
        
        # Get available flights
        flights_response = requests.get(f'{BASE_URL}/api/flights/')
        flights = flights_response.json()
        
        if not flights:
            print("No flights available for booking")
            return
        
        # Choose first flight for booking
        first_flight = flights[0]
        flight_id = first_flight['id']
        
        # Create booking
        booking_url = f'{BASE_URL}/api/bookings/'
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        booking_data = {
            'flight': flight_id,
            'passengers': 2,
            'status': 'CONFIRMED'
        }
        
        booking_response = requests.post(
            booking_url, 
            headers=headers, 
            json=booking_data
        )
        
        print("Booking Creation Response:")
        print("Status Code:", booking_response.status_code)
        print("Response:", json.dumps(booking_response.json(), indent=2))
    
    except Exception as e:
        print(f"Error in booking workflow: {e}")

def main():
    test_booking_workflow()

if __name__ == '__main__':
    main()