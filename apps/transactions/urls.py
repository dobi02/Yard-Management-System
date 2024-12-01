from django.urls import path
from .views import TransactionsView, TransactionDetailView

urlpatterns = [
    path('api/transactions/', TransactionsView.as_view(), name='transactions-list'),
    path('api/transactions/<str:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
]
