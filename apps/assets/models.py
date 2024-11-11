#
# 장비들의 정보를 관리하는 Models를 정의한 모듈입니다.
#
#
from django.db import models

from apps.parking.models import ParkingSlots


class Trucks(models.Model):
    truck_id = models.CharField(primary_key=True, max_length=6)
    type = models.CharField(max_length=10, null=False)
    location = models.ForeignKey(ParkingSlots, on_delete=models.CASCADE, null=False)


class Chassis(models.Model):
    chassis_id = models.CharField(primary_key=True, max_length=6)
    type = models.CharField(max_length=10, null=False)
    location = models.ForeignKey(ParkingSlots, on_delete=models.CASCADE, null=False)


class Trailers(models.Model):
    trailer_id = models.CharField(primary_key=True, max_length=6)
    size = models.CharField(max_length=5, null=False)
    location = models.ForeignKey(ParkingSlots, on_delete=models.CASCADE, null=False)


class Containers(models.Model):
    container_id = models.CharField(primary_key=True, max_length=6)
    type = models.CharField(max_length=10, null=False)
    size = models.CharField(max_length=5, null=False)
    location = models.ForeignKey(ParkingSlots, on_delete=models.CASCADE, null=False)
