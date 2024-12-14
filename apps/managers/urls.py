from django.urls import path
from . import views
from .views import ManagersView, ManagerDetailView

urlpatterns = [
    path('api/login/', views.login_manager, name='login_manager'),
    path('api/managers/', ManagersView.as_view(), name='managers-create'),
    path('api/managers/<str:pk>/', ManagerDetailView.as_view(), name='managers-detail'),
]