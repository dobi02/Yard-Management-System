from django.urls import path
from .views import DivisionsView, DivisionDetailView, YardsView, YardDetailView, SitesView, SiteDetailView, ParkingSlotDetailView, ParkingSlotsView, AvailableSlotsBySiteTypeView

urlpatterns = [
    # Divisions
    path('divisions/', DivisionsView.as_view(), name='divisions-list'),
    path('divisions/<str:pk>/', DivisionDetailView.as_view(), name='division-detail'),

    # Yards
    path('yards/', YardsView.as_view(), name='yards-list'),
    path('yards/<str:pk>/', YardDetailView.as_view(), name='yard-detail'),
    path('yards/<str:pk>/count/', AvailableSlotsBySiteTypeView.as_view(), name='yards-count'),

    # Sites
    path('sites/', SitesView.as_view(), name='sites-list'),
    path('sites/<str:pk>/', SiteDetailView.as_view(), name='site-detail'),

    path('parking-slots/', ParkingSlotsView.as_view(), name='parking-slots-list'),
    path('parking-slots/<str:pk>/', ParkingSlotDetailView.as_view(), name='parking-slot-detail'),
]
