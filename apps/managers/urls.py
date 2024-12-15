from django.urls import path
from . import views
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('api/login/', CustomTokenObtainPairView.as_view(), name='login_manager'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/managers/', ManagersView.as_view(), name='managers-create'),
    path('api/managers/<str:pk>/', ManagerDetailView.as_view(), name='managers-detail'),
]