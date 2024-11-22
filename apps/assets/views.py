from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Trucks, Chassis, Trailers, Containers
from .serializers import TrucksSerializer, ChassisSerializer, TrailersSerializer, ContainersSerializer

#Patch or put?

# Trucks View
class TrucksView(APIView):
    def get(self, request):
        trucks = Trucks.objects.all()
        serializer = TrucksSerializer(trucks, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TrucksSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    def get(self, request):
        chassis = Chassis.objects.all()
        serializer = ChassisSerializer(chassis, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ChassisSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    def get(self, request):
        trailers = Trailers.objects.all()
        serializer = TrailersSerializer(trailers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = TrailersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
    def get(self, request):
        containers = Containers.objects.all()
        serializer = ContainersSerializer(containers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ContainersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
