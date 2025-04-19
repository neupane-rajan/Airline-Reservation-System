from django.db import models
from django.conf import settings
from flights.models import Flight

class Booking(models.Model):
    STATUS_CHOICES = [
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
        ('PENDING', 'Pending')
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    
    flight = models.ForeignKey(
        Flight, 
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    
    booking_date = models.DateTimeField(auto_now_add=True)
    
    status = models.CharField(
        max_length=20, 
        choices=STATUS_CHOICES, 
        default='PENDING'
    )
    
    passengers = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.user.username} - {self.flight.flight_number}"

    class Meta:
        verbose_name_plural = "Bookings"
        ordering = ['-booking_date']