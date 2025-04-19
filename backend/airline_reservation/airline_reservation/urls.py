from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from bookings.views import BookingViewSet
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from users.views import (
    UserViewSet, 
    user_registration, 
    user_login, 
    user_logout,
    admin_dashboard
)
from flights.views import FlightViewSet, AirportViewSet
from core.views import welcome_view  # Add this import

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'flights', FlightViewSet, basename='flight')
router.register(r'airports', AirportViewSet, basename='airport')
router.register(r'bookings', BookingViewSet, basename='booking')
urlpatterns = [
    # Add a root/welcome route
    path('', welcome_view, name='welcome'),
    
    path('admin/', admin.site.urls),
    
    # Authentication URLs
    path('api/register/', user_registration, name='user_registration'),
    path('api/login/', user_login, name='user_login'),
    path('api/logout/', user_logout, name='user_logout'),
    
    # Token URLs
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Admin Dashboard
    path('api/admin/dashboard/', admin_dashboard, name='admin_dashboard'),
    
    # Router URLs
    path('api/', include(router.urls)),
]