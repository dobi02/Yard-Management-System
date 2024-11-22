from django.urls import path
from .views import ParkingSlotsView, ParkingSlotDetailView

urlpatterns = [
    path('parking-slots/', ParkingSlotsView.as_view(), name='parking-slots-list'),
    path('parking-slots/<str:pk>/', ParkingSlotDetailView.as_view(), name='parking-slot-detail'),
]
