from rest_framework import serializers
from .models import *


class TransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = '__all__'
        read_only_fields = ['transaction_id', 'transaction_created', 'transaction_updated']

    # def create(self, validated_data):
    #     # 서버 날짜 기준으로 transaction_time 설정
    #     from django.utils.timezone import now
    #     transaction_time = now()
    #
    #     # transaction_id 생성
    #     transaction_date_str = transaction_time.strftime('%Y-%m-%d')
    #     transaction_count = Transactions.objects.filter(
    #         transaction_time=transaction_time.date()
    #     ).count()
    #     transaction_id = f"{transaction_date_str}_{transaction_count + 1:05d}"
    #
    #     # Transactions 객체 생성
    #     validated_data['transaction_id'] = transaction_id
    #     validated_data['transaction_time'] = transaction_time
    #
    #     return super().create(validated_data)

