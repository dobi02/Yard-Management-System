from django.urls import path
from .views import DriversView, DriverDetailView, DriversYardListView, DriversDivisionListView
from . import views

urlpatterns = [
    path('api/drivers/', DriversView.as_view(), name='drivers-create'),
    path('api/drivers/<str:pk>/', DriverDetailView.as_view(), name='driver-detail'),
    path('api/login', views.login_driver, name='login_driver'),
    path('api/yard-drivers/<str:yard_id>/', views.DriversYardListView.as_view(), name='yard_drivers'),
    path('api/division-drivers/<str:division_id>/', views.DriversDivisionListView.as_view(), name='division_drivers'),
]
