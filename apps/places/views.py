from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Divisions, Yards, Sites, ParkingSlots
from apps.assets.models import Trucks, Chassis, Trailers, Containers
from .serializers import DivisionsSerializer, YardsSerializer, SitesSerializer, ParkingSlotsSerializer
from rest_framework.permissions import IsAuthenticated
from apps.assets.models import *
from apps.assets.serializers import *
from apps.utils.permissions import *


# Divisions Views
class DivisionsView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        divisions = Divisions.objects.all()
        serializer = DivisionsSerializer(divisions, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DivisionsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DivisionDetailView(APIView):
    permission_classes = [IsManager]

    def get(self, request, pk):
        try:
            division = Divisions.objects.get(pk=pk)
        except Divisions.DoesNotExist:
            return Response({"error": "Division not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DivisionsSerializer(division)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            division = Divisions.objects.get(pk=pk)
        except Divisions.DoesNotExist:
            return Response({"error": "Division not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DivisionsSerializer(division, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Yards Views
class YardsView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        yards = Yards.objects.all()
        serializer = YardsSerializer(yards, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = YardsSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class YardDetailView(APIView):
    permission_classes = [IsManager]

    def get(self, request, pk):
        try:
            yard = Yards.objects.filter(division_id=pk)
        except Yards.DoesNotExist:
            return Response({"error": "Yard not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = YardsSerializer(yard, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            yard = Yards.objects.get(pk=pk)
        except Yards.DoesNotExist:
            return Response({"error": "Yard not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = YardsSerializer(yard, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            yard = Yards.objects.get(pk=pk)
        except Yards.DoesNotExist:
            return Response({"error": "Yard not found"}, status=status.HTTP_404_NOT_FOUND)

        # 해당 Yard와 연결된 ParkingSlots 중 is_occupied=True인 항목이 있는지 확인
        has_occupied_slots = ParkingSlots.objects.filter(
            site_id__yard_id=yard,  # Sites와 Yards를 통해 ParkingSlots 조회
            is_occupied=True  # is_occupied가 True인 항목만 필터링
        ).exists()

        if has_occupied_slots:
            return Response(
                {"error": "Cannot delete Yard because it has occupied parking slots."},
                status=status.HTTP_400_BAD_REQUEST
            )

        yard.delete()
        return Response({"message": "Yard deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Sites Views
class SitesView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        sites = Sites.objects.all()
        serializer = SitesSerializer(sites, many=True)
        return Response(serializer.data)


class SiteDetailView(APIView):
    permission_classes = [IsManager]

    def get(self, request, pk):
        try:
            site = Sites.objects.filter(yard_id=pk)
        except Sites.DoesNotExist:
            return Response({"error": "Site not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SitesSerializer(site, many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            site = Sites.objects.get(pk=pk)
        except Sites.DoesNotExist:
            return Response({"error": "Site not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = SitesSerializer(site, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ParkingSlotsView(APIView):
    permission_classes = [IsManager]

    def get(self, request):
        parking_slots = ParkingSlots.objects.all()
        serializer = ParkingSlotsSerializer(parking_slots, many=True)
        return Response(serializer.data)


class ParkingSlotDetailView(APIView):
    permission_classes = [IsManager]

    def get(self, request, pk):
        try:
            parking_slot = ParkingSlots.objects.filter(site_id=pk).order_by("slot_id")
        except ParkingSlots.DoesNotExist:
            return Response({"error": "Parking slot not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParkingSlotsSerializer(parking_slot,many=True)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            parking_slot = ParkingSlots.objects.get(pk=pk)
        except ParkingSlots.DoesNotExist:
            return Response({"error": "Parking slot not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParkingSlotsSerializer(parking_slot, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AvailableSlotsBySiteTypeView(APIView):
    permission_classes = [IsManager]

    def get(self, request, pk):
        yard_id = pk
        if not Yards.objects.filter(pk=pk).exists():
            return Response({"error": "Invalid yard_id"}, status=400)

        sites = Sites.objects.filter(yard_id=yard_id)
        site_type_data = {}
        trailers_list = []
        chassis_list = []
        trucks_list = []
        containers_list = []
        parking_slots = []
        for site in sites:
            slots = ParkingSlots.objects.filter(site_id=site)
            ser = ParkingSlotsSerializer(slots, many=True)
            parking_slots.append(ser.data)
            total_slots = slots.count()
            available_slots = ParkingSlots.objects.filter(site_id=site, is_occupied=False).count()
            occupied_slots = ParkingSlots.objects.filter(site_id=site, is_occupied=True)

            print(occupied_slots)
            for slot in occupied_slots:
                print(slot, " b")
                #print(Chassis.objects.get(parked_place=slot) , " aa")

                if Chassis.objects.filter(parked_place=slot):
                    serializer = ChassisSerializer(Chassis.objects.get(parked_place=slot))
                    chassis_list.append(serializer.data)

                if Trailers.objects.filter(parked_place=slot):
                    a = Trailers.objects.get(parked_place=slot)
                    serializer = TrailersSerializer(a)
                    trailers_list.append(serializer.data)

                if Trucks.objects.filter(parked_place=slot):
                    a = Trucks.objects.get(parked_place=slot)
                    serializer = TrucksSerializer(a)
                    trucks_list.append(serializer.data)

                if Containers.objects.filter(parked_place=slot):
                    serializer = ContainersSerializer(Containers.objects.get(parked_place=slot))
                    containers_list.append(serializer.data)

            if site.asset_type not in site_type_data:
                site_type_data[site.asset_type] = {
                    "total_slots": 0,
                    "available_slots": 0
                }

            site_type_data[site.asset_type]["total_slots"] += total_slots
            site_type_data[site.asset_type]["available_slots"] += available_slots



        result = [
            {
                "asset_type": asset_type,
                "total_slots": data["total_slots"],
                "available_slots": data["available_slots"],
                "occupied_slots": data["total_slots"] - data["available_slots"]
            }
            for asset_type, data in site_type_data.items()
        ]
        print(result)
        return Response({"site_list": result, "chassis_list": chassis_list, "trucks_list": trucks_list,
                         "containers_list": containers_list, "trailers_list": trailers_list, "parking_slots": parking_slots})


class AssetCountView(APIView):
    permission_classes = [IsManager]

    def get(self, request, yard_id):
        # Get the specified yard
        yard = get_object_or_404(Yards, yard_id=yard_id)

        # Retrieve all Sites for the yard
        sites = yard.sites_set.all()  # Reverse relationship to Sites

        # Get all ParkingSlots linked to the Sites
        parking_slots = ParkingSlots.objects.filter(site_id__in=sites)

        # Count equipment for each type
        trucks_count = Trucks.objects.filter(parked_place__in=parking_slots).count()
        chassis_count = Chassis.objects.filter(parked_place__in=parking_slots).count()
        trailers_count = Trailers.objects.filter(parked_place__in=parking_slots).count()
        containers_count = Containers.objects.filter(parked_place__in=parking_slots).count()

        # Prepare the response
        data = {
            "yard_id": yard_id,
            "equipment_count": {
                "trucks": trucks_count,
                "chassis": chassis_count,
                "trailers": trailers_count,
                "containers": containers_count,
            }
        }

        return Response(data, status=200)

class YardAssetView(APIView):
    permission_classes = [IsManager]

    def get(self, request, yard_id):
        yard = get_object_or_404(Yards, yard_id=yard_id)

        # Retrieve all Sites for the yard
        sites = yard.sites_set.all()  # Reverse relationship to Sites

        # Get all ParkingSlots linked to the Sites
        parking_slots = ParkingSlots.objects.filter(site_id__in=sites)

        trucks = Trucks.objects.filter(parked_place__in=parking_slots)
        trailers = Trailers.objects.filter(parked_place__in=parking_slots)
        chassis = Chassis.objects.filter(parked_place__in=parking_slots)
        containers = Containers.objects.filter(parked_place__in=parking_slots)

        data = {
            'trucks': TrucksSerializer(trucks, many=True).data,
            'trailers': TrailersSerializer(trailers, many=True).data,
            'chassis': ChassisSerializer(chassis, many=True).data,
            'containers': ContainersSerializer(containers, many=True).data,
        }

        return Response(data, status=200)

# class ParkedAssetView(APIView):
#     def get(self, request, yard_id):
#         yard = get_object_or_404(Yards, yard_id=yard_id)
#
#         query = """
#         SELECT * FROM parking_slots ps
#         JOIN sites s on s.site_id = ps.site_id_id
#         LEFT JOIN trucks as t ON (ps.slot_id = t.parked_place_id)
#         WHERE yard_id_id = 'aaa_02' and asset_type= 'truck';
#         """
#         table =