#
# 드라이버에 관한 기능을 처리하는 models을 정의한 모듈입니다.
#
#
from django.db import models

from apps.places.models import Divisions


class Drivers(models.Model):
    driver_id = models.CharField(primary_key=True, max_length=8)
    division_id = models.ForeignKey(Divisions, on_delete=models.CASCADE, null=False)
    name = models.CharField(max_length=50, null=False)
    phone_number = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=255, null=False)


