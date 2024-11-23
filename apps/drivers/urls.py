from django.urls import path
from .views import DriversView, DriverDetailView

urlpatterns = [
    path('drivers/', DriversView.as_view(), name='drivers-list'),
    path('drivers/<str:pk>/', DriverDetailView.as_view(), name='driver-detail'),
]
