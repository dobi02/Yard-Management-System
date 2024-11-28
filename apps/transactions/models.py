#
# Transaction에 관련한 것들의 Models를 정의한 모듈입니다.
#
#
from django.db import models
from apps.assets.models import Trucks, Chassis, Containers, Trailers
from apps.places.models import Yards
from apps.drivers.models import Drivers


class Transactions(models.Model):
    transaction_id = models.CharField(max_length=20, primary_key=True)
    transaction_type = models.CharField(max_length=3, null=False)
    transaction_time = models.DateField()

    driver_id = models.ForeignKey(Drivers, on_delete=models.DO_NOTHING, null=False)
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


