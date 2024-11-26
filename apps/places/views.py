from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Divisions, Yards, Sites
from .serializers import DivisionsSerializer, YardsSerializer, SitesSerializer

# Divisions Views
class DivisionsView(APIView):
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

    def delete(self, request, pk):
        try:
            division = Divisions.objects.get(pk=pk)
        except Divisions.DoesNotExist:
            return Response({"error": "Division not found"}, status=status.HTTP_404_NOT_FOUND)

        division.delete()
        return Response({"message": "Division deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# Yards Views
class YardsView(APIView):
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
    def get(self, request):
        sites = Sites.objects.all()
        serializer = SitesSerializer(sites, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = SitesSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SiteDetailView(APIView):
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

    def delete(self, request, pk):
        try:
            site = Sites.objects.get(pk=pk)
        except Sites.DoesNotExist:
            return Response({"error": "Site not found"}, status=status.HTTP_404_NOT_FOUND)

        site.delete()
        return Response({"message": "Site deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
