from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Drivers
from .serializers import DriversSerializer


class DriversView(APIView):
    def get(self, request):
        drivers = Drivers.objects.all()
        serializer = DriversSerializer(drivers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DriversSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DriverDetailView(APIView):
    def get(self, request, pk):
        try:
            driver = Drivers.objects.get(pk=pk)
        except Drivers.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DriversSerializer(driver)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            driver = Drivers.objects.get(pk=pk)
        except Drivers.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = DriversSerializer(driver, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            driver = Drivers.objects.get(pk=pk)
        except Drivers.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        driver.delete()
        return Response({"message": "Driver deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
