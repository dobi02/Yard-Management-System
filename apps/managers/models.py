#
# 관리자에 관한 Models를 정의한 모듈입니다.
#
#
from django.db import models

class managers(models.Model):
    manager_id = models.CharField(max_length=20, primary_key=True)
    #access_rigths = models.CharField(max_length=10) 어떻게 할지 고민중
    name = models.CharField(max_length=50, null=False)
    phone_number = models.CharField(max_length=20)
    password_hash = models.CharField(max_length=255, null=False)
