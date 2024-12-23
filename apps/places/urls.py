from django.urls import path
from .views import (DivisionsView, DivisionDetailView, YardsView, YardDetailView, SitesView,
                    SiteDetailView, ParkingSlotDetailView, ParkingSlotsView, AssetCountView, AvailableSlotsBySiteTypeView,
                    YardAssetView)

urlpatterns = [
    # Divisions
    path('api/divisions/', DivisionsView.as_view(), name='divisions-list'),
    path('api/divisions/<str:pk>/', DivisionDetailView.as_view(), name='division-detail'),

    # Yards
    path('api/yards/', YardsView.as_view(), name='yards-list'),
    path('api/yards/<str:pk>/', YardDetailView.as_view(), name='yard-detail'),
    path('api/yards/<str:pk>/count/', AvailableSlotsBySiteTypeView.as_view(), name='yards-count'),

    # Sites
    path('api/sites/', SitesView.as_view(), name='sites-list'),
    path('api/sites/<str:pk>/', SiteDetailView.as_view(), name='site-detail'),

    path('api/parking-slots/', ParkingSlotsView.as_view(), name='parking-slots-list'),
    path('api/parking-slots/<str:pk>/', ParkingSlotDetailView.as_view(), name='parking-slot-detail'),

    path('api/yards/<str:yard_id>/yard_asset_count/', AssetCountView.as_view(), name='yard-asset-count'),
    path('api/yards/<str:yard_id>/yard_assets', YardAssetView.as_view(), name='yard-assets'),

]
