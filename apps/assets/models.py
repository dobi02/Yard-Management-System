#
# 장비들의 정보를 관리하는 Models를 정의한 모듈입니다.
#
#
from django.db import models

from apps.places.models import ParkingSlots


class Trucks(models.Model):
    truck_id = models.CharField(primary_key=True, max_length=6, editable=False)
    type = models.CharField(max_length=10, null=False)
    parked_place = models.ForeignKey(ParkingSlots, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'trucks'

    def save(self, *args, **kwargs):
        if not self.truck_id:
            last_id = Trucks.objects.order_by('-truck_id').first()
            next_id = int(last_id.truck_id[2:]) + 1 if last_id else 1
            self.truck_id = f"tk{next_id:04d}"
        super().save(*args, **kwargs)


class Chassis(models.Model):
    chassis_id = models.CharField(primary_key=True, max_length=6, editable=False)
    type = models.CharField(max_length=10, null=False)
    parked_place = models.ForeignKey(ParkingSlots, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'chassis'

    def save(self, *args, **kwargs):
        if not self.chassis_id:
            last_id = Chassis.objects.order_by('-chassis_id').first()
            next_id = int(last_id.chassis_id[2:]) + 1 if last_id else 1
            self.chassis_id = f"cs{next_id:04d}"
        super().save(*args, **kwargs)


class Trailers(models.Model):
    trailer_id = models.CharField(primary_key=True, max_length=6, editable=False)
    size = models.CharField(max_length=5, null=False)
    parked_place = models.ForeignKey(ParkingSlots, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'trailers'

    def save(self, *args, **kwargs):
        if not self.trailer_id:
            last_id = Trailers.objects.order_by('-trailer_id').first()
            next_id = int(last_id.trailer_id[2:]) + 1 if last_id else 1
            self.trailer_id = f"tl{next_id:04d}"
        super().save(*args, **kwargs)


class Containers(models.Model):
    container_id = models.CharField(primary_key=True, max_length=6, editable=False)
    type = models.CharField(max_length=10, null=False)
    size = models.CharField(max_length=5, null=False)
    parked_place = models.ForeignKey(ParkingSlots, on_delete=models.SET_NULL, null=True)

    class Meta:
        db_table = 'containers'

    def save(self, *args, **kwargs):
        if not self.container_id:
            last_id = Containers.objects.order_by('-container_id').first()
            next_id = int(last_id.container_id[2:]) + 1 if last_id else 1
            self.container_id = f"ct{next_id:04d}"
        super().save(*args, **kwargs)

