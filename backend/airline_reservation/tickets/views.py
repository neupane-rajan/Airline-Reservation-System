import random
import string

class TicketViewSet(viewsets.ModelViewSet):
    serializer_class = TicketSerializer

    def get_queryset(self):
        return Ticket.objects.filter(booking__user=self.request.user)

    def generate_seat_number(self):
        """Generate unique seat number"""
        rows = 'ABCDEF'
        seat_row = random.choice(rows)
        seat_number = random.randint(1, 30)
        return f"{seat_row}{seat_number}"

    def create(self, request, *args, **kwargs):
        booking_id = request.data.get('booking')
        
        try:
            booking = Booking.objects.get(id=booking_id, user=request.user)
            
            # Check if ticket already exists
            if Ticket.objects.filter(booking=booking).exists():
                return Response({
                    'error': 'Ticket already generated for this booking'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create ticket
            ticket = Ticket.objects.create(
                booking=booking,
                seat_number=self.generate_seat_number(),
                ticket_number=f'TKT-{"".join(random.choices(string.ascii_uppercase + string.digits, k=6))}'
            )
            
            serializer = self.get_serializer(ticket)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        except Booking.DoesNotExist:
            return Response({
                'error': 'Booking not found'
            }, status=status.HTTP_404_NOT_FOUND)