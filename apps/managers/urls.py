from django.urls import path
from .views import login_manager

urlpatterns = [
    path('login/', login_manager, name='login_manager'),
]