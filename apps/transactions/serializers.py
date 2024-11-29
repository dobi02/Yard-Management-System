from rest_framework import serializers
from .models import Transactions


class TransactionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transactions
        fields = [
            'transaction_id', 'transaction_type', 'transaction_time', 'driver_id',
            'origin_yard_id', 'destination_yard_id', 'truck_id', 'chassis_id',
            'container_id', 'trailer_id'
        ]
        read_only_fields = ['transaction_id', 'transaction_time']

    def create(self, validated_data):
        # 서버 날짜 기준으로 transaction_time 설정
        from django.utils.timezone import now
        transaction_time = now()

        # transaction_id 생성
        transaction_date_str = transaction_time.strftime('%Y-%m-%d')
        transaction_type = validated_data['transaction_type']
        transaction_count = Transactions.objects.filter(
            transaction_time=transaction_time.date()
        ).count()
        transaction_id = f"{transaction_date_str}_{transaction_type}_{transaction_count + 1:05d}"

        # Transactions 객체 생성
        validated_data['transaction_id'] = transaction_id
        validated_data['transaction_time'] = transaction_time

        return super().create(validated_data)


