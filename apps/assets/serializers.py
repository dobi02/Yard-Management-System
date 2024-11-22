from rest_framework import serializers
from .models import *


class TrucksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trucks
        fields = ['truck_id', 'type', 'parked_place']


class ChassisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chassis
        fields = ['chassis_id', 'type', 'parked_place']


class TrailersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trailers
        fields = ['trailer_id', 'size', 'parked_place']


class ContainersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Containers
        fields = ['container_id', 'type', 'size', 'parked_place']
