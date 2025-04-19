from django.shortcuts import render
from django.http import JsonResponse

def welcome_view(request):
    return JsonResponse({
        'message': 'Welcome to Airline Reservation System API',
        'available_endpoints': [
            '/admin/',
            '/api/register/',
            '/api/login/',
            '/api/token/',
            '/api/flights/',
            '/api/airports/'
        ]
    })