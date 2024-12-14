from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.places.models import Yards
from .models import Trucks, Chassis, Trailers, Containers
from django.shortcuts import get_object_or_404
from .serializers import TrucksSerializer, ChassisSerializer, TrailersSerializer, ContainersSerializer
from apps.places.models import ParkingSlots
from apps.utils import services
from rest_framework.permissions import IsAuthenticated


# Trucks View
class TrucksView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        trucks = Trucks.objects.all()
        serializer = TrucksSerializer(trucks, many=True)
        return Response(serializer.data)

    def post(self, request):
        yard = request.data.get('yard')
        typ = request.data.get('type')
        quantity = int(request.data.get('quantity'))

        # serializer = TrucksSerializer(data={"type" : typ, "parked_place" : "Null"})
        # print(serializer.is_valid())
        # print(slot)
        for i in range(quantity):
            slot = services.get_available_parking_slot(yard, "truck")
            if slot:
                serializer = TrucksSerializer(data={"type" : typ, "parked_place" : slot.slot_id})
                if serializer.is_valid():

                    serializer.save()
                    slot.is_occupied = True
                    slot.save()
                    if i + 1 != quantity:
                        continue
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            truck = Trucks.objects.get(pk=pk)
        except Trucks.DoesNotExist:
            return Response({"error": "Truck not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TrucksSerializer(truck, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            truck = Trucks.objects.get(pk=pk)
        except Trucks.DoesNotExist:
            return Response({"error": "Truck not found"}, status=status.HTTP_404_NOT_FOUND)

        truck.delete()
        return Response({"message": "Truck deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Chassis View
class ChassisView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        chassis = Chassis.objects.all()
        serializer = ChassisSerializer(chassis, many=True)
        return Response(serializer.data)

    def post(self, request):
        yard = request.data.get('yard')
        typ = request.data.get('type')
        quantity = int(request.data.get('quantity'))

        for i in range(quantity):
            slot = services.get_available_parking_slot(yard, "chassis")
            if slot:
                serializer = ChassisSerializer(data={"type": typ, "parked_place": slot.slot_id})
                if serializer.is_valid():
                    serializer.save()
                    slot.is_occupied = True
                    slot.save()
                    if i + 1 != quantity:
                        continue
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            chassis = Chassis.objects.get(pk=pk)
        except Chassis.DoesNotExist:
            return Response({"error": "Chassis not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ChassisSerializer(chassis, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            chassis = Chassis.objects.get(pk=pk)
        except Chassis.DoesNotExist:
            return Response({"error": "Chassis not found"}, status=status.HTTP_404_NOT_FOUND)

        chassis.delete()
        return Response({"message": "Chassis deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Trailers View
class TrailersView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        trailers = Trailers.objects.all()
        serializer = TrailersSerializer(trailers, many=True)
        return Response(serializer.data)

    def post(self, request):
        yard = request.data.get('yard')
        size = request.data.get('size')
        quantity = int(request.data.get('quantity'))

        for i in range(quantity):
            slot = services.get_available_parking_slot(yard, "trailer")
            if slot:
                serializer = TrailersSerializer(data={"size": size, "parked_place": slot.slot_id})
                if serializer.is_valid():
                    serializer.save()
                    slot.is_occupied = True
                    slot.save()
                    if i + 1 != quantity:
                        continue
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            trailer = Trailers.objects.get(pk=pk)
        except Trailers.DoesNotExist:
            return Response({"error": "Trailer not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = TrailersSerializer(trailer, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            trailer = Trailers.objects.get(pk=pk)
        except Trailers.DoesNotExist:
            return Response({"error": "Trailer not found"}, status=status.HTTP_404_NOT_FOUND)

        trailer.delete()
        return Response({"message": "Trailer deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Containers View
class ContainersView(APIView):
    #permission_classes = [IsAuthenticated]

    def get(self, request):
        containers = Containers.objects.all()
        serializer = ContainersSerializer(containers, many=True)
        return Response(serializer.data)

    def post(self, request):
        yard = request.data.get('yard')
        typ = request.data.get('type')
        size = request.data.get('size')
        quantity = int(request.data.get('quantity'))

        for i in range(quantity):
            slot = services.get_available_parking_slot(yard, "container")
            if slot:
                serializer = ContainersSerializer(data={"type": typ, "parked_place": slot.slot_id, "size": size})
                if serializer.is_valid():
                    serializer.save()
                    slot.is_occupied = True
                    slot.save()
                    if i + 1 != quantity:
                        continue
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response(status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        try:
            container = Containers.objects.get(pk=pk)
        except Containers.DoesNotExist:
            return Response({"error": "Container not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ContainersSerializer(container, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            container = Containers.objects.get(pk=pk)
        except Containers.DoesNotExist:
            return Response({"error": "Container not found"}, status=status.HTTP_404_NOT_FOUND)

        container.delete()
        return Response({"message": "Container deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class YardContainerView(APIView):
    def get(self, request, yard_id):
        yard = get_object_or_404(Yards, yard_id=yard_id)

        containers = Containers.objects.filter(parked_place__site_id__yard_id=yard, state__contains='parked')

        return Response(ContainersSerializer(containers, many=True).data, status=200)


class YardTruckView(APIView):
    def get(self, request, yard_id):
        yard = get_object_or_404(Yards, yard_id=yard_id)

        trucks = Trucks.objects.filter(parked_place__site_id__yard_id=yard, state__contains='parked')
        return Response(TrucksSerializer(trucks, many=True).data, status=200)


class YardChassisView(APIView):
    def get(self, request, yard_id):
        yard = get_object_or_404(Yards, yard_id=yard_id)

        chassis = Chassis.objects.filter(parked_place__site_id__yard_id=yard, state__contains='parked')

        return Response(ChassisSerializer(chassis, many=True).data, status=200)


class YardTrailerView(APIView):
    def get(self, request, yard_id):
        yard = get_object_or_404(Yards, yard_id=yard_id)

        trailers = Trailers.objects.filter(parked_place__site_id__yard_id=yard, state__contains='parked')

        return Response(TrailersSerializer(trailers, many=True).data, status=200)