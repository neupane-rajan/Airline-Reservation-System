from rest_framework import serializers
from .models import Booking
from flights.serializers import FlightSerializer

class BookingSerializer(serializers.ModelSerializer):
    flight = FlightSerializer(read_only=True)
    flight_id = serializers.PrimaryKeyRelatedField(
        queryset=Booking.flight.field.related_model.objects.all(), 
        source='flight', 
        write_only=True
    )

    class Meta:
        model = Booking
        fields = [
            'id', 
            'user', 
            'flight', 
            'flight_id',
            'booking_date', 
            'status', 
            'passengers'
        ]
        read_only_fields = ['id', 'user', 'booking_date']

    def create(self, validated_data):
        # Automatically set the user to the current user
        user = self.context['request'].user
        validated_data['user'] = user
        return super().create(validated_data)