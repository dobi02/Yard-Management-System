from apps.places.models import ParkingSlots, Sites, Yards


def get_available_parking_slot(yard_id, asset_type):
    """
    주어진 yard_id와 asset_type에 따라 사용 가능한 주차 슬롯 반환.

    Args:
        yard_id (str): Yards 테이블의 yard_id.
        asset_type (str): Sites 테이블의 asset_type.

    Returns:
        ParkingSlots: 사용 가능한 주차 슬롯 객체. 없을 경우 None.
    """
    try:
        # Yards -> Sites -> ParkingSlots 탐색
        site = Sites.objects.filter(yard_id__yard_id=yard_id, asset_type=asset_type).first()
        if not site:
            return None  # 해당 site가 없을 때

        # 사용 가능한 ParkingSlot 찾기
        slot = ParkingSlots.objects.filter(site_id=site, is_occupied=False).first()
        return slot
    except Exception as e:
        # 오류가 발생했을 경우 로깅 또는 에러 처리
        print(f"Error in get_available_parking_slot: {e}")
        return None