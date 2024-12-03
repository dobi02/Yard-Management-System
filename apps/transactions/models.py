#
# Transaction에 관련한 것들의 Models를 정의한 모듈입니다.
#
#
from django.db import models
from apps.assets.models import Trucks, Chassis, Containers, Trailers
from apps.places.models import Yards
from apps.drivers.models import Drivers
from apps.managers.models import Managers
from django.contrib.auth.models import User


class Transactions(models.Model):
    transaction_id = models.CharField(max_length=20, primary_key=True)
    transaction_status = models.CharField(max_length=20, null=False)  # find_driver, accepted, moving, arrive, canceled, other
    transaction_created = models.DateTimeField(auto_now_add=True)  # set when created
    transaction_updated = models.DateTimeField(auto_now=True)  # update when changed
    departure_time = models.DateTimeField(null=True)  # 예상
    departure_time_real = models.DateTimeField(null=True)
    arrival_time = models.DateTimeField(null=True)  # 예상
    arrival_time_real = models.DateTimeField(null=True)
    manager_id = models.ForeignKey(Managers, on_delete=models.DO_NOTHING, null=False)

    transaction_type = models.CharField(max_length=3, null=False)
    transaction_time = models.DateField()

    driver_id = models.ForeignKey(Drivers, on_delete=models.DO_NOTHING, null=True)
    origin_yard_id = models.ForeignKey(Yards, on_delete=models.DO_NOTHING,
                                null=False, related_name='origin_yard_id')
    destination_yard_id = models.ForeignKey(Yards, on_delete=models.DO_NOTHING,
                                            null=True, related_name='destination_yard_id')
    truck_id = models.ForeignKey(Trucks, on_delete=models.DO_NOTHING, null=True)
    chassis_id = models.ForeignKey(Chassis, on_delete=models.DO_NOTHING, null=True)
    container_id = models.ForeignKey(Containers, on_delete=models.DO_NOTHING, null=True)
    trailer_id = models.ForeignKey(Trailers, on_delete=models.DO_NOTHING, null=True)

    class Meta:
        db_table = 'transactions'

