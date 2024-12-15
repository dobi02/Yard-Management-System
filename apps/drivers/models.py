#
# 드라이버에 관한 기능을 처리하는 models을 정의한 모듈입니다.
#
#
from django.db import models
from apps.places.models import Divisions
from django.contrib.auth.models import User


class Drivers(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='drivers')
    division_id = models.ForeignKey(Divisions, on_delete=models.SET_NULL, null=True)
    state = models.CharField(max_length=10, null=False, default="off_work")  #ready, waiting, moving, off_work
    phone_number = models.CharField(max_length=20)

    def delete(self):
        if self.division_id:
            self.division_id = None
        self.state = "deleted"
        self.save()

    def hard_delete(self, *args, **kwargs):
        """
        Permanently delete the trailer from the database.
        """
        super().delete(*args, **kwargs)

    class Meta:
        db_table = 'drivers'


