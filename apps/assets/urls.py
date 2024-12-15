from django.urls import path
from .views import *


urlpatterns = [
    path('api/trucks/', TrucksView.as_view(), name='trucks-list'),
    path('api/trucks/<str:pk>/', TruckDetailView.as_view(), name='truck-detail'),
    path('api/chassis/', ChassisView.as_view(), name='chassis-list'),
    path('api/chassis/<str:pk>/', ChassisDetailView.as_view(), name='chassis-detail'),
    path('api/trailers/', TrailersView.as_view(), name='trailers-list'),
    path('api/trailers/<str:pk>/', TrailerDetailView.as_view(), name='trailer-detail'),
    path('api/containers/', ContainersView.as_view(), name='containers-list'),
    path('api/containers/<str:pk>/', ContainerDetailView.as_view(), name='container-detail'),

    path('api/trucks/yards/<str:yard_id>/', YardTruckView.as_view(), name='yard-truck'),
    path('api/chassis/yards/<str:yard_id>/', YardChassisView.as_view(), name='yard-chassis'),
    path('api/trailers/yards/<str:yard_id>/', YardTrailerView.as_view(), name='yard-trailer'),
    path('api/containers/yards/<str:yard_id>/', YardContainerView.as_view(), name='yard-container'),

    path('api/moving/trucks/', TruckMovingView.as_view(), name='moving-truck'),
    path('api/moving/trailers/', TrailerMovingView.as_view(), name='moving-trailer'),
    path('api/moving/containers/', ContainerMovingView.as_view(), name='moving-container'),
    path('api/moving/chassis/', ChassisMovingView.as_view(), name='moving-chassis'),
]
