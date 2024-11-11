#
# 장소에 사용되는 Models를 정의한 모듈입니다.
#
#
from django.db import models


class Divisions(models.Model):
    division_id = models.CharField(max_length=4, primary_key=True)


class Yards(models.Model):
    yard_id = models.CharField(max_length=6, primary_key=True)
    division_id = models.ForeignKey(Divisions, on_delete=models.CASCADE, null=False)


class Sites(models.Model):
    site_id = models.CharField(max_length=10, primary_key=True)
    yard_id = models.ForeignKey(Yards, on_delete=models.CASCADE)
    asset_type = models.CharField(max_length=10, null=False)

