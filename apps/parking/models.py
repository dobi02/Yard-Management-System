#
# 주차장의 자리에 관한 것들의 Models를 정의한 모듈입니다.
#
#
from django.contrib.sites.models import Site
from django.db import models


class ParkingSlots(models.Model):
    slot_id = models.CharField(max_length=14, primary_key=True)
    site_id = models.ForeignKey(Site, on_delete=models.CASCADE, null=False)
    is_occupied = models.BooleanField(default=False)

    class Meta:
        db_table = 'parking_slots'
