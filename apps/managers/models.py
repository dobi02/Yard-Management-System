#
# 관리자에 관한 Models를 정의한 모듈입니다.
# 이후에 장고의 User모델을 사용하게 바꿔야할듯
#
from django.db import models
from django.contrib.auth.models import User

class managers(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='managers')
    access_rigths = models.CharField(max_length=10)
    phone_number = models.CharField(max_length=20)

    def __str__(self):
        return self.name
