from django.contrib import admin
from .models import Airport, Flight

@admin.register(Airport)
class AirportAdmin(admin.ModelAdmin):
    list_display = ('name', 'code', 'city', 'country')
    search_fields = ('name', 'code', 'city', 'country')
    list_filter = ('country', 'city')

@admin.register(Flight)
class FlightAdmin(admin.ModelAdmin):
    list_display = (
        'flight_number', 
        'departure_airport', 
        'arrival_airport', 
        'departure_time', 
        'status', 
        'available_seats', 
        'price'
    )
    list_filter = (
        'status', 
        'departure_airport', 
        'arrival_airport', 
        'departure_time'
    )
    search_fields = ('flight_number',)