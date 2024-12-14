from django.urls import path
from .views import *

urlpatterns = [
    path('api/transactions/', TransactionsView.as_view(), name='transactions-list'),
    path('api/transactions/<str:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('api/transactions/driver/<str:driver_id>/', TransactionsByDriverView.as_view(), name='transaction-by-driver'),
    path('api/transactions/driver/<str:driver_id>/<str:pk>/', TransactionsDriverView.as_view(), name='transaction-driver'),
    path('api/transactions/moving/<str:yard_id>/', MovingAssetsView.as_view(), name='moving-assets'),
]
