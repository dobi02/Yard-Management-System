from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Divisions, Yards, Sites, ParkingSlots
from apps.assets.models import Trucks, Chassis, Trailers, Containers
from .serializers import DivisionsSerializer, YardsSerializer, SitesSerializer, ParkingSlotsSerializer
from rest_framework.permissions import IsAuthenticated


# Divisions Views
class DivisionsView(APIView):
    #permission_classes = [IsAuthenticated]

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
    #permission_classes = [IsAuthenticated]

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
    #permission_classes = [IsAuthenticated]

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
    #permission_classes = [IsAuthenticated]

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

        yard.delete()
        return Response({"message": "Yard deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Sites Views
class SitesView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        sites = Sites.objects.all()
        serializer = SitesSerializer(sites, many=True)
        return Response(serializer.data)


class SiteDetailView(APIView):
    #permission_classes = [IsAuthenticated]

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
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        parking_slots = ParkingSlots.objects.all()
        serializer = ParkingSlotsSerializer(parking_slots, many=True)
        return Response(serializer.data)


class ParkingSlotDetailView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            parking_slot = ParkingSlots.objects.get(pk=pk)
        except ParkingSlots.DoesNotExist:
            return Response({"error": "Parking slot not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ParkingSlotsSerializer(parking_slot)
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


class AssetCountView(APIView):
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