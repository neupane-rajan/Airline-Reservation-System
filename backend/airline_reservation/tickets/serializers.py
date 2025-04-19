from rest_framework import serializers
from .models import Ticket
from bookings.serializers import BookingSerializer

class TicketSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)

    class Meta:
        model = Ticket
        fields = '__all__'