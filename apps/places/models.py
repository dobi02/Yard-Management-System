#
# 장소에 사용되는 Models를 정의한 모듈입니다.
#
#
from django.db import models


class Divisions(models.Model):
    division_id = models.CharField(max_length=4, primary_key=True)

    class Meta:
        db_table = 'divisions'

    def __str__(self):
        return self.division_id


class Yards(models.Model):
    yard_id = models.CharField(max_length=7, primary_key=True)
    division_id = models.ForeignKey(Divisions, on_delete=models.CASCADE, null=True)
    is_deleted = models.BooleanField(default=False)

    def delete(self):
        self.division_id = None
        self.is_deleted = True
        self.save()

        # 관련 Sites와 ParkingSlots를 Hard Delete
        related_sites = Sites.objects.filter(yard_id=self)
        for site in related_sites:
            # 각 Site와 연결된 ParkingSlots 삭제
            ParkingSlots.objects.filter(site_id=site).delete()
            # Site 삭제
            site.delete()


    def save(self, *args, **kwargs):
        if not self.yard_id:  # yard_id가 없는 경우에만 생성
            # 현재 division에 속한 Yards 개수 확인
            count = Yards.objects.filter(division=self.division_id).count() + 1
            self.yard_id = f"{self.division_id}_{count:02d}"
        super().save(*args, **kwargs)

    def __str__(self):
        return self.yard_id

    class Meta:
        db_table = 'yards'


class Sites(models.Model):
    site_id = models.CharField(max_length=17, primary_key=True)
    yard_id = models.ForeignKey(Yards, on_delete=models.CASCADE)
    asset_type = models.CharField(max_length=10, null=False)

    class Meta:
        db_table = 'sites'


class ParkingSlots(models.Model):
    slot_id = models.CharField(max_length=20, primary_key=True)
    site_id = models.ForeignKey(Sites, on_delete=models.CASCADE, null=False)
    is_occupied = models.BooleanField(default=False)

    class Meta:
        db_table = 'parking_slots'
