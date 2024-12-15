from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from apps.places.models import Yards
from .models import Trucks, Chassis, Trailers, Containers
from django.shortcuts import get_object_or_404
from .serializers import TrucksSerializer, ChassisSerializer, TrailersSerializer, ContainersSerializer
from apps.places.models import ParkingSlots
from apps.utils import services
from django.db import transaction
from django.core.exceptions import ValidationError
from rest_framework.permissions import IsAuthenticated


# Trucks View
class TrucksView(APIView):
    permission_classes = [IsAuthenticated]

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


class TruckDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        truck = get_object_or_404(Trucks, pk=pk)
        serializer = TrucksSerializer(truck)
        return Response(serializer.data)

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
    permission_classes = [IsAuthenticated]

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


class ChassisDetailView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            chassis = Chassis.objects.get(pk=pk)
        except Chassis.DoesNotExist:
            return Response({"error": "Chassis not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ChassisSerializer(chassis)
        return Response(serializer.data)

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
    # permission_classes = [IsAuthenticated]

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


class TrailerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, pk):
        try:
            trailer = Trailers.objects.get(pk=pk)
        except Trailers.DoesNotExist:
            return Response({"error": "Trailer not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = TrailersSerializer(trailer)
        return Response(serializer.data)

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
    permission_classes = [IsAuthenticated]

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


class ContainerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            container = Containers.objects.get(pk=pk)
        except Containers.DoesNotExist:
            return Response({"error": "Container not found"}, status=status.HTTP_404_NOT_FOUND)
        serializer = ContainersSerializer(container)
        return Response(serializer.data)

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


class TruckMovingView(APIView):
    def patch(self, request):
        try:
            with transaction.atomic():
                destination_slot = get_object_or_404(ParkingSlots, pk=request.data.get('destination_slot'))
                truck = get_object_or_404(Trucks, pk=request.data.get('truck'))
                origin_slot = get_object_or_404(ParkingSlots, pk=truck.parked_place.slot_id)

                if destination_slot.site_id.asset_type != origin_slot.site_id.asset_type:
                    raise ValidationError("types are not equal.")

                if origin_slot.site_id.yard_id != destination_slot.site_id.yard_id:
                    raise ValidationError("yards are not equal.")

                if destination_slot.is_occupied:
                    raise ValidationError("destination slot is occupied.")

                truck.parked_place = destination_slot
                origin_slot.is_occupied = False
                destination_slot.is_occupied = True

                # 변경 사항 저장
                truck.save()
                origin_slot.save()
                destination_slot.save()

                # 성공 응답
                return Response({
                    "message": "Truck moved successfully.",
                    "origin_slot": origin_slot.slot_id,
                    "destination_slot": truck.parked_place.slot_id,
                    "truck": truck.pk
                }, status=200)
        except ValidationError as e:
            # ValidationError에 대한 사용자 친화적인 응답
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            # 기타 예상치 못한 에러 처리
            print(f"Error processing patch: {e}")
            return Response({"error": "An unexpected error occurred."}, status=500)

class TrailerMovingView(APIView):
    def patch(self, request):
        try:
            with transaction.atomic():
                destination_slot = get_object_or_404(ParkingSlots, pk=request.data.get('destination_slot'))
                trailer = get_object_or_404(Trailers, pk=request.data.get('trailer'))
                origin_slot = get_object_or_404(ParkingSlots, pk=trailer.parked_place.slot_id)

                if destination_slot.site_id.asset_type != origin_slot.site_id.asset_type:
                    raise ValidationError("types are not equal.")

                if origin_slot.site_id.yard_id != destination_slot.site_id.yard_id:
                    raise ValidationError("yards are not equal.")

                if destination_slot.is_occupied:
                    raise ValidationError("destination slot is occupied.")

                trailer.parked_place = destination_slot
                origin_slot.is_occupied = False
                destination_slot.is_occupied = True

                # 변경 사항 저장
                trailer.save()
                origin_slot.save()
                destination_slot.save()

                # 성공 응답
                return Response({
                    "message": "Trailer moved successfully.",
                    "origin_slot": origin_slot.slot_id,
                    "destination_slot": trailer.parked_place.slot_id,
                    "truck": trailer.pk
                }, status=200)
        except ValidationError as e:
            # ValidationError에 대한 사용자 친화적인 응답
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            # 기타 예상치 못한 에러 처리
            print(f"Error processing patch: {e}")
            return Response({"error": "An unexpected error occurred."}, status=500)


class ChassisMovingView(APIView):
    def patch(self, request):
        try:
            with transaction.atomic():
                destination_slot = get_object_or_404(ParkingSlots, pk=request.data.get('destination_slot'))
                chassis = get_object_or_404(Chassis, pk=request.data.get('chassis'))
                origin_slot = get_object_or_404(ParkingSlots, pk=chassis.parked_place.slot_id)

                if destination_slot.site_id.asset_type != origin_slot.site_id.asset_type:
                    raise ValidationError("types are not equal.")

                if origin_slot.site_id.yard_id != destination_slot.site_id.yard_id:
                    raise ValidationError("yards are not equal.")

                if destination_slot.is_occupied:
                    raise ValidationError("destination slot is occupied.")

                chassis.parked_place = destination_slot
                origin_slot.is_occupied = False
                destination_slot.is_occupied = True

                if chassis.state == 'combined':
                    container = get_object_or_404(Containers, parked_place=chassis.parked_place)
                    container.parked_place = destination_slot
                    container.save()

                # 변경 사항 저장
                chassis.save()
                origin_slot.save()
                destination_slot.save()

                # 성공 응답
                return Response({
                    "message": "Chassis moved successfully.",
                    "origin_slot": origin_slot.slot_id,
                    "destination_slot": chassis.parked_place.slot_id,
                    "truck": chassis.pk
                }, status=200)
        except ValidationError as e:
            # ValidationError에 대한 사용자 친화적인 응답
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            # 기타 예상치 못한 에러 처리
            print(f"Error processing patch: {e}")
            return Response({"error": "An unexpected error occurred."}, status=500)


class ContainerMovingView(APIView):
    def patch(self, request):
        try:
            with transaction.atomic():
                destination_slot = get_object_or_404(ParkingSlots, pk=request.data.get('destination_slot'))
                container = get_object_or_404(Containers, pk=request.data.get('container'))
                origin_slot = get_object_or_404(ParkingSlots, pk=container.parked_place.slot_id)

                if origin_slot.site_id.yard_id != destination_slot.site_id.yard_id:
                    raise ValidationError("yards are not equal.")

                if container.state == 'combined':
                    origin_chassis = get_object_or_404(Chassis, parked_place=origin_slot)
                    origin_chassis.state = "parked"
                    origin_chassis.save()
                elif container.state == 'parked':
                    origin_slot.is_occupied = False
                else:
                    raise ValidationError("container state is invalid.")

                if destination_slot.site_id.asset_type == "container":
                    if destination_slot.is_occupied:
                        raise ValidationError("destination slot is occupied.")

                    container.state = 'parked'
                    destination_slot.is_occupied = True
                elif destination_slot.site_id.asset_type == "chassis":
                    destination_chassis = get_object_or_404(Chassis, parked_place=destination_slot) #Chassis가 있을때만 올릴 수 있음
                    if destination_chassis.state == 'combined':
                        raise ValidationError("destination chassis is already combined.")

                    destination_chassis.state = 'combined'
                    container.state = 'combined'
                    destination_chassis.save()
                else:
                    raise ValidationError("types are not equal.")

                container.parked_place = destination_slot

                # 변경 사항 저장
                container.save()
                origin_slot.save()
                destination_slot.save()

                # 성공 응답
                return Response({
                    "message": "Container moved successfully.",
                    "origin_slot": origin_slot.slot_id,
                    "destination_slot": container.parked_place.slot_id,
                    "truck": container.pk
                }, status=200)
        except ValidationError as e:
            # ValidationError에 대한 사용자 친화적인 응답
            return Response({"error": str(e)}, status=400)
        except Exception as e:
            # 기타 예상치 못한 에러 처리
            print(f"Error processing patch: {e}")
            return Response({"error": "An unexpected error occurred."}, status=500)