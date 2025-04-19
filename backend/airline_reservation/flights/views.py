from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Flight, Airport
from .serializers import FlightSerializer, AirportSerializer

class FlightViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Flight.objects.all()
    serializer_class = FlightSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = Flight.objects.all()
        
        # Optional: Add filtering capabilities
        departure = self.request.query_params.get('departure')
        arrival = self.request.query_params.get('arrival')
        
        if departure:
            queryset = queryset.filter(departure_airport__code=departure)
        if arrival:
            queryset = queryset.filter(arrival_airport__code=arrival)
        
        return queryset

class AirportViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Airport.objects.all()
    serializer_class = AirportSerializer
    permission_classes = [AllowAny]