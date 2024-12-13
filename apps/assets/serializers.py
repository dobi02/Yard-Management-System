from rest_framework import serializers
from .models import *


class TrucksSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trucks
        fields = '__all__'


class ChassisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chassis
        fields = '__all__'


class TrailersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Trailers
        fields = '__all__'


class ContainersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Containers
        fields = '__all__'
