from rest_framework import serializers
from .models import Divisions, Yards, Sites, ParkingSlots


class DivisionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Divisions
        fields = '__all__'


class YardsSerializer(serializers.ModelSerializer):
    division_id = serializers.CharField(write_only=True)

    class Meta:
        model = Yards
        fields = ['yard_id', 'division_id']  # 'yard_id'는 읽기 전용, 'division_id'는 입력받음
        read_only_fields = ['yard_id']

    def create(self, validated_data):
        # division_id를 기반으로 Division 객체 가져오기
        division_id = validated_data.pop('division_id')
        try:
            division = Divisions.objects.get(division_id=division_id)
        except Divisions.DoesNotExist:
            raise serializers.ValidationError({"division_id": "Division not found."})

        last_yard = Yards.objects.filter(division_id=division_id).order_by('-yard_id').first()
        counts = last_yard.yard_id[-2:]
        count = int(counts)+1
        yard_id = f"{division_id}_{count:02d}"

        # Yards 생성
        yard = Yards.objects.create(
            division_id=division,
            yard_id=yard_id,
            **validated_data
        )
        return yard


class SitesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sites
        fields = '__all__'

class ParkingSlotsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ParkingSlots
        fields = '__all__'
