from django.urls import path
from .views import TransactionsView, TransactionDetailView

urlpatterns = [
    path('transactions/', TransactionsView.as_view(), name='transactions-list'),
    path('transactions/<str:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
]
