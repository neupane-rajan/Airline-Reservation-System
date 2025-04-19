from django.db import models
from bookings.models import Booking
import uuid

class Ticket(models.Model):
    booking = models.OneToOneField(Booking, on_delete=models.CASCADE)
    ticket_number = models.CharField(
        max_length=50, 
        unique=True, 
        default=uuid.uuid4
    )
    seat_number = models.CharField(max_length=10)
    issue_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Ticket {self.ticket_number}"