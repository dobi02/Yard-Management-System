from django.urls import path
from .views import DivisionsView, DivisionDetailView, YardsView, YardDetailView, SitesView, SiteDetailView

urlpatterns = [
    # Divisions
    path('divisions/', DivisionsView.as_view(), name='divisions-list'),
    path('divisions/<str:pk>/', DivisionDetailView.as_view(), name='division-detail'),

    # Yards
    path('yards/', YardsView.as_view(), name='yards-list'),
    path('yards/<str:pk>/', YardDetailView.as_view(), name='yard-detail'),

    # Sites
    path('sites/', SitesView.as_view(), name='sites-list'),
    path('sites/<str:pk>/', SiteDetailView.as_view(), name='site-detail'),
]
