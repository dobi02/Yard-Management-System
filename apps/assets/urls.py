from django.urls import path
from .views import TrucksView, ChassisView, TrailersView, ContainersView

urlpatterns = [
    path('api/trucks/', TrucksView.as_view(), name='trucks-list'),
    path('api/trucks/<str:pk>/', TrucksView.as_view(), name='truck-detail'),
    path('api/chassis/', ChassisView.as_view(), name='chassis-list'),
    path('api/chassis/<str:pk>/', ChassisView.as_view(), name='chassis-detail'),
    path('api/trailers/', TrailersView.as_view(), name='trailers-list'),
    path('api/trailers/<str:pk>/', TrailersView.as_view(), name='trailer-detail'),
    path('api/containers/', ContainersView.as_view(), name='containers-list'),
    path('api/containers/<str:pk>/', ContainersView.as_view(), name='container-detail'),
]
