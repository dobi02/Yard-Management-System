#
# Transaction에 관련한 것들의 Models를 정의한 모듈입니다.
#
#
from lib2to3.pgen2.driver import Driver

from django.db import models

from apps.assets.models import Trucks, Chassis, Containers
from apps.places.models import Yards


class Transactions(models.Model):
    transaction_id = models.CharField(max_length=20, primary_key=True)
    transaction_type = models.CharField(max_length=3, null=False)
    transaction_time = models.DateField()

    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE, null=False)
    yard_id = models.ForeignKey(Yards, on_delete=models.CASCADE, null=False)
    truck_id = models.ForeignKey(Trucks, null=True, on_delete=models.SET_NULL)
    chassis_id = models.ForeignKey(Chassis, null=True, on_delete=models.SET_NULL)
    container_id = models.ForeignKey(Containers, null=True, on_delete=models.SET_NULL)
    trailer_id = models.ForeignKey(Trucks, null=True, on_delete=models.SET_NULL)


