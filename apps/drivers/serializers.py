from django.contrib.auth.hashers import make_password
from rest_framework import serializers
from .models import Drivers
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password', 'first_name', 'last_name', 'email')


class DriversSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Drivers
        fields = ['user', 'phone_number', 'division_id', 'state']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        user = User.objects.create_user(**user_data)
        driver = Drivers.objects.create(user=user, **validated_data)

        return driver

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            validated_data['password_hash'] = make_password(password)
        return super().update(instance, validated_data)
