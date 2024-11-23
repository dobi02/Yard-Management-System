from rest_framework import serializers
from .models import ParkingSlots


class ParkingSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlots
        fields = '__all__'
