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
    return f"logoutuser_{uuid.uuid4().hex[:8]}"

def test_logout_workflow():
    print("\nLogout Workflow Test:")
    
    try:
        # Register a new user
        unique_username = generate_unique_username()
        register_url = f'{BASE_URL}/api/register/'
        register_data = {
            "username": unique_username,
            "email": f"{unique_username}@example.com",
            "password": "LogoutUser2024!"
        }
        register_response = requests.post(register_url, json=register_data)
        register_result = register_response.json()
        
        # Extract refresh token
        refresh_token = register_result['refresh']
        
        # Logout
        logout_url = f'{BASE_URL}/api/logout/'
        logout_headers = {
            'Authorization': f'Bearer {register_result["access"]}',
            'Content-Type': 'application/json'
        }
        logout_data = {
            'refresh_token': refresh_token
        }
        
        logout_response = requests.post(
            logout_url, 
            headers=logout_headers, 
            json=logout_data
        )
        
        print("Logout Response:")
        print("Status Code:", logout_response.status_code)
        print("Response:", json.dumps(logout_response.json(), indent=2))
    
    except Exception as e:
        print(f"Error in logout workflow: {e}")

def main():
    test_logout_workflow()

if __name__ == '__main__':
    main()