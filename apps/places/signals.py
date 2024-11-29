from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Yards, Sites, ParkingSlots


@receiver(post_save, sender=Yards)
def create_sites_and_parking_slots(sender, instance, created, **kwargs):
    if created:
        asset_types = ['truck', 'trailer', 'chassis', 'container']
        parking_counts = {'truck': 30, 'trailer': 10, 'chassis': 20, 'container': 40}

        for asset_type in asset_types:
            # Sites 데이터 생성
            site_id = f"{instance.yard_id}_{asset_type}"
            site = Sites.objects.create(
                site_id=site_id,
                yard=instance,
                asset_type=asset_type
            )

            # ParkingSlots 데이터 생성
            for i in range(1, parking_counts[asset_type] + 1):
                slot_id = f"{site_id}_{i:02d}"  # 예: 1_truck_01
                ParkingSlots.objects.create(
                    slot_id=slot_id,
                    site=site
                )
