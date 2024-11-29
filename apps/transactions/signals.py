from django.db.models.signals import pre_save
from django.dispatch import receiver
from apps.places.models import Yards, Divisions
from apps.drivers.models import Drivers
from apps.assets.models import Trucks, Chassis, Containers, Trailers
from django.core.exceptions import ValidationError
from apps.transactions.models import Transactions
from apps.utils.services import get_available_parking_slot  # 주차 슬롯 가져오는 함수


@receiver(pre_save, sender=Transactions)
def handle_transaction(sender, instance, created, **kwargs):
    """
    Transactions 추가 전에 유효성 검사를 진행하고, 실패 시 예외를 발생시켜 롤백
    """
    transaction = instance

    try:
        with transaction.atomic():
            if transaction.transaction_type == 'OUT':
                # 'OUT' 트랜잭션 처리
                if transaction.truck_id:
                    transaction.truck_id.parked_place = None
                    transaction.truck_id.save()
                if transaction.chassis_id:
                    transaction.chassis_id.parked_place = None
                    transaction.chassis_id.save()
                if transaction.container_id:
                    transaction.container_id.parked_place = None
                    transaction.container_id.save()
                if transaction.trailer_id:
                    transaction.trailer_id.parked_place = None
                    transaction.trailer_id.save()

                # Driver의 division_id를 None으로 변경
                if transaction.driver_id:
                    driver = transaction.driver_id
                    driver.division_id = None
                    driver.save()

            elif transaction.transaction_type == 'IN':
                # 'IN' 트랜잭션 처리
                if transaction.destination_yard_id:
                    yard = transaction.destination_yard_id

                    # 각 장비에 대해 사용 가능한 주차 슬롯 지정
                    if transaction.truck_id:
                        slot = get_available_parking_slot(yard.yard_id, 'truck')
                        if not slot:  # Slot이 없는 경우 예외 발생
                            raise ValidationError("No available parking slot for truck.")
                        transaction.truck_id.parked_place = slot
                        transaction.truck_id.save()

                    if transaction.chassis_id:
                        slot = get_available_parking_slot(yard.yard_id, 'chassis')
                        if not slot:
                            raise ValidationError("No available parking slot for chassis.")
                        transaction.chassis_id.parked_place = slot
                        transaction.chassis_id.save()

                    if transaction.container_id:
                        slot = get_available_parking_slot(yard.yard_id, 'container')
                        if not slot:
                            raise ValidationError("No available parking slot for container.")
                        transaction.container_id.parked_place = slot
                        transaction.container_id.save()

                    if transaction.trailer_id:
                        slot = get_available_parking_slot(yard.yard_id, 'trailer')
                        if not slot:
                            raise ValidationError("No available parking slot for trailer.")
                        transaction.trailer_id.parked_place = slot
                        transaction.trailer_id.save()

                    # Driver의 division_id를 destination_yard_id가 속하는 division_id로 설정
                    if transaction.driver_id:
                        driver = transaction.driver_id
                        driver.division_id = yard.division_id
                        driver.save()
            else:
                # transaction_type이 유효하지 않으면 예외 발생
                raise ValidationError(f"Invalid transaction_type: {transaction.transaction_type}")
    except Exception as e:
            # 에러가 발생하면 트랜잭션 롤백
            print(f"Error processing transaction: {e}")
            raise  # 예외를 상위로 전달하여 Transactions 저장 차단

