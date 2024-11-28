from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Managers


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email')


class ManagersSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Managers
        fields = ['user', 'phone_number', 'access_rigths']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        driver = Managers.objects.create(user=user, **validated_data)
        return driver
