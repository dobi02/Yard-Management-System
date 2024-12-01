"""confi URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Dashboard
    2. Add a URL to urlpatterns:  path('', Dashboard.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('apps.managers.urls')),
    path('assets/', include('apps.assets.urls')),
    path('', include('apps.drivers.urls')),
    path('places/', include('apps.places.urls')),
    path('', include('apps.transactions.urls')),
    path('managers/', include('apps.managers.urls')),
    path('drivers/', include('apps.drivers.urls')),
]
