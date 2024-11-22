from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ParkingSlots
from .serializers import ParkingSlotsSerializer

class ParkingSlotsView(APIView):
    def get(self, request):
        parking_slots = ParkingSlots.objects.all()
        serializer = ParkingSlotsSerializer(parking_slots, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ParkingSlotsSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ParkingSlotDetailView(APIView):
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

    def delete(self, request, pk):
        try:
            parking_slot = ParkingSlots.objects.get(pk=pk)
        except ParkingSlots.DoesNotExist:
            return Response({"error": "Parking slot not found"}, status=status.HTTP_404_NOT_FOUND)

        parking_slot.delete()
        return Response({"message": "Parking slot deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
