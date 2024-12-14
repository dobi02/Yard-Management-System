from django.db.models.signals import pre_save
from django.dispatch import receiver

from apps.drivers.serializers import DriversSerializer
from apps.places.models import Yards, Divisions, ParkingSlots
from apps.drivers.models import Drivers
from apps.utils import services
from django.utils.timezone import now
from apps.assets.models import Trucks, Chassis, Containers, Trailers
from apps.assets.serializers import TrucksSerializer, ChassisSerializer, ContainersSerializer, TrailersSerializer
from django.core.exceptions import ValidationError

from apps.places.serializers import DivisionsSerializer, ParkingSlotsSerializer
from apps.transactions.models import Transactions
from django.db import transaction
from apps.utils.services import get_available_parking_slot  # 주차 슬롯 가져오는 함수


@receiver(pre_save, sender=Transactions)
def handle_transaction(sender, instance, **kwargs):
    """
    Transactions 추가 전에 유효성 검사를 진행하고, 실패 시 예외를 발생시켜 롤백
    """
    try:
        with transaction.atomic():
            if instance.transaction_status == 'waiting' or True:
                # 'waiting' 트랜잭션 처리
                if instance.truck_id:
                    if instance.truck_id.state != "parked":
                        raise ValidationError("Truck is not parked.")
                    instance.truck_id.state = "waiting"
                    instance.truck_id.save()

                if instance.chassis_id:
                    if instance.chassis_id.state != "parked":
                        raise ValidationError("Chassis is not parked.")
                    instance.chassis_id.state = "waiting"
                    instance.chassis_id.save()

                if instance.container_id:
                    if instance.container_id.state != "parked":
                        raise ValidationError("Container is not parked.")
                    instance.container_id.state = "waiting"
                    instance.container_id.save()

                if instance.trailer_id:
                    if instance.trailer_id.state != "parked":
                        raise ValidationError("Trailer is not parked.")
                    instance.trailer_id.state = "waiting"
                    instance.trailer_id.save()

                # Driver의 division_id를 None으로 변경
                if instance.driver_id:
                    instance.driver_id.state = "responding"
                    instance.driver_id.save()

            elif instance.transaction_status == 'canceled':
                # 'waiting' 트랜잭션 처리
                if instance.truck_id:
                    instance.truck_id.state = "parked"
                    instance.truck_id.save()

                if instance.chassis_id:
                    instance.chassis_id.state = "parked"
                    instance.chassis_id.save()

                if instance.container_id:
                    instance.container_id.state = "parked"
                    instance.container_id.save()

                if instance.trailer_id:
                    instance.trailer_id.state = "parked"
                    instance.trailer_id.save()

                # Driver의 division_id를 None으로 변경
                if instance.driver_id:
                    instance.driver_id.state = "ready"
                    instance.driver_id.save()

            elif instance.transaction_status == 'accepted':
                # 'accepted' 트랜잭션 처리

                if instance.driver_id:
                    instance.driver_id.state = "waiting"
                    instance.driver_id.save()

            elif instance.transaction_status == 'moving':
                # 'moving' 트랜잭션 처리
                if instance.truck_id:
                    # slot = ParkingSlots.objects.get(pk=instance.truck_id.parked_place)
                    # slot.is_occupied = False
                    # slot.save()
                    instance.truck_id.parked_place.is_occupied = False
                    instance.truck_id.parked_place.save()
                    instance.truck_id.state = "moving"
                    instance.truck_id.parked_place = None
                    instance.truck_id.save()

                if instance.chassis_id:
                    instance.chassis_id.parked_place.is_occupied = False
                    instance.chassis_id.parked_place.save()
                    instance.chassis_id.state = "moving"
                    instance.chassis_id.parked_place = None
                    instance.chassis_id.save()

                if instance.container_id:
                    instance.container_id.parked_place.is_occupied = False
                    instance.container_id.parked_place.save()
                    instance.container_id.state = "moving"
                    instance.container_id.parked_place = None
                    instance.container_id.save()

                if instance.trailer_id:
                    instance.trailer_id.parked_place.is_occupied = False
                    instance.trailer_id.parked_place.save()
                    instance.trailer_id.state = "moving"
                    instance.trailer_id.parked_place = None
                    instance.trailer_id.save()

                # Driver의 division_id를 None으로 변경
                if instance.driver_id:
                    instance.driver_id.state = "moving"
                    instance.driver_id.division_id = None
                    instance.driver_id.save()

                instance.departure_time_real = now()


            elif instance.transaction_status == 'arrive':
                # 'arrive' 트랜잭션 처리
                if instance.truck_id:
                    instance.truck_id.state = "arrive"
                    instance.truck_id.save()

                if instance.chassis_id:
                    instance.chassis_id.state = "arrive"
                    instance.chassis_id.save()

                if instance.container_id:
                    instance.container_id.state = "arrive"
                    instance.container_id.save()

                if instance.trailer_id:
                    instance.trailer_id.state = "arrive"
                    instance.trailer_id.save()

                # Driver의 division_id를 None으로 변경
                if instance.driver_id:
                    instance.driver_id.state = "arrive"
                    instance.driver_id.division_id = instance.destination_yard_id.division_id
                    instance.driver_id.save()

                instance.arrival_time_real = now()
                # instance.save()

            elif instance.transaction_status == 'finished':
                # 'moving' 트랜잭션 처리
                if instance.truck_id:
                    slot = services.get_available_parking_slot(instance.destination_yard_id.yard_id, "truck")
                    if slot:
                        instance.truck_id.state = "parked"
                        instance.truck_id.parked_place = slot
                        instance.truck_id.save()
                        slot.is_occupied = True
                        slot.save()

                        # a = Trucks.objects.get(id=instance.truck_id)
                        # data = {"state": "parked"}
                        # serializer = TrucksSerializer(a, data=data, partial=True)
                        # if serializer.is_valid():
                        #     serializer.save()
                        #     slot.is_occupied = True
                        #     slot.save()


                if instance.chassis_id:
                    slot = services.get_available_parking_slot(instance.destination_yard_id.yard_id, "chassis")
                    if slot:
                        instance.chassis_id.state = "parked"
                        instance.chassis_id.parked_place = slot
                        instance.chassis_id.save()
                        slot.is_occupied = True
                        slot.save()

                if instance.container_id:
                    slot = services.get_available_parking_slot(instance.destination_yard_id.yard_id, "container")
                    if slot:
                        instance.container_id.state = "parked"
                        instance.container_id.parked_place = slot
                        instance.container_id.save()
                        slot.is_occupied = True
                        slot.save()

                if instance.trailer_id:
                    slot = services.get_available_parking_slot(instance.destination_yard_id.yard_id, "trailer")
                    if slot:
                        instance.trailer_id.state = "parked"
                        instance.trailer_id.parked_place = slot
                        instance.trailer_id.save()
                        slot.is_occupied = True
                        slot.save()

                # Driver의 division_id를 None으로 변경
                if instance.driver_id:
                    instance.driver_id.state = "ready"
                    instance.driver_id.division_id = instance.destination_yard_id.division_id
                    instance.driver_id.save()

                instance.arrival_time_real = now()
                # instance.save()


            else:
                # transaction_type이 유효하지 않으면 예외 발생
                raise ValidationError(f"Invalid transaction_status: {instance.transaction_status}")
    except Exception as e:
            # 에러가 발생하면 트랜잭션 롤백
            print(f"Error processing transaction: {e}")
            raise  # 예외를 상위로 전달하여 Transactions 저장 차단

