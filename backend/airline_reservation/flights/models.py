from django.db import models
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.core.validators import MinValueValidator
from decimal import Decimal

class Airport(models.Model):
    code = models.CharField(max_length=10, unique=True)
    name = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} ({self.code})"

class Flight(models.Model):
    FLIGHT_STATUS_CHOICES = [
        ('SCHEDULED', 'Scheduled'),
        ('DEPARTED', 'Departed'),
        ('ARRIVED', 'Arrived'),
        ('CANCELLED', 'Cancelled'),
        ('DELAYED', 'Delayed')
    ]

    flight_number = models.CharField(max_length=20, unique=True)
    
    departure_airport = models.ForeignKey(
        Airport, 
        on_delete=models.CASCADE, 
        related_name='departing_flights'
    )
    
    arrival_airport = models.ForeignKey(
        Airport, 
        on_delete=models.CASCADE, 
        related_name='arriving_flights'
    )
    
    departure_time = models.DateTimeField()
    arrival_time = models.DateTimeField()
    
    status = models.CharField(
        max_length=20, 
        choices=FLIGHT_STATUS_CHOICES, 
        default='SCHEDULED'
    )
    
    capacity = models.PositiveIntegerField(
        default=180,
        validators=[MinValueValidator(1)]
    )
    
    available_seats = models.PositiveIntegerField(
        default=180,
        validators=[MinValueValidator(0)]
    )
    
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )

    # Remove created_at and updated_at temporarily
    # We'll add these back after migration
    # Add these fields back
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    updated_at = models.DateTimeField(auto_now=True, editable=False)
    def clean(self):
        # Validate that departure time is before arrival time
        if self.departure_time and self.arrival_time:
            if self.departure_time >= self.arrival_time:
                raise ValidationError({
                    'departure_time': 'Departure time must be before arrival time.',
                    'arrival_time': 'Arrival time must be after departure time.'
                })

        # Validate available seats do not exceed capacity
        if self.available_seats > self.capacity:
            raise ValidationError({
                'available_seats': f'Available seats cannot exceed total capacity of {self.capacity}.'
            })

    def save(self, *args, **kwargs):
        self.full_clean()
        
        if not self.available_seats:
            self.available_seats = self.capacity
        
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.flight_number}: {self.departure_airport} to {self.arrival_airport}"

    class Meta:
        unique_together = [['departure_airport', 'arrival_airport', 'departure_time']]