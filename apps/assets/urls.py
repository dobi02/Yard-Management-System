from django.urls import path
from .views import TrucksView, ChassisView, TrailersView, ContainersView

urlpatterns = [
    path('trucks/', TrucksView.as_view(), name='trucks-list'),
    path('trucks/<str:pk>/', TrucksView.as_view(), name='truck-detail'),
    path('chassis/', ChassisView.as_view(), name='chassis-list'),
    path('chassis/<str:pk>/', ChassisView.as_view(), name='chassis-detail'),
    path('trailers/', TrailersView.as_view(), name='trailers-list'),
    path('trailers/<str:pk>/', TrailersView.as_view(), name='trailer-detail'),
    path('containers/', ContainersView.as_view(), name='containers-list'),
    path('containers/<str:pk>/', ContainersView.as_view(), name='container-detail'),
]
