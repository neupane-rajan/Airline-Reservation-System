from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db import transaction

from .models import Booking
from .serializers import BookingSerializer
from flights.models import Flight

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Booking.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                # Get flight and validate
                flight_id = request.data.get('flight')
                passengers = int(request.data.get('passengers', 1))
                
                # Validate flight
                try:
                    flight = Flight.objects.select_for_update().get(id=flight_id)
                except Flight.DoesNotExist:
                    return Response({
                        'error': 'Flight not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                # Check seat availability
                if flight.available_seats < passengers:
                    return Response({
                        'error': f'Only {flight.available_seats} seats available'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Create booking
                booking = Booking.objects.create(
                    user=request.user,
                    flight=flight,
                    passengers=passengers,
                    status='CONFIRMED'
                )
                
                # Reduce available seats
                flight.available_seats -= passengers
                flight.save()
                
                serializer = self.get_serializer(booking)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['POST'])
    def cancel_booking(self, request, pk=None):
        try:
            with transaction.atomic():
                # Fetch the booking
                try:
                    booking = Booking.objects.select_for_update().get(
                        pk=pk, 
                        user=request.user
                    )
                except Booking.DoesNotExist:
                    return Response({
                        'error': 'Booking not found'
                    }, status=status.HTTP_404_NOT_FOUND)
                
                # Check if booking is already cancelled
                if booking.status == 'CANCELLED':
                    return Response({
                        'error': 'Booking is already cancelled'
                    }, status=status.HTTP_400_BAD_REQUEST)
                
                # Restore available seats
                flight = booking.flight
                flight.available_seats += booking.passengers
                flight.save()
                
                # Update booking status
                booking.status = 'CANCELLED'
                booking.save()
                
                return Response({
                    'message': 'Booking cancelled successfully',
                    'booking_id': booking.id
                }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)