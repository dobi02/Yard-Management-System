from rest_framework import serializers
from .models import Divisions, Yards, Sites


class DivisionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Divisions
        fields = '__all__'


class YardsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Yards
        fields = '__all__'


class SitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sites
        fields = '__all__'
