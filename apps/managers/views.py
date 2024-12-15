from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Managers
from .serializers import ManagersSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class ManagersView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        managers = Managers.objects.all()
        serializer = ManagersSerializer(managers, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ManagersSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ManagerDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            driver = Managers.objects.get(pk=pk)
        except Managers.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ManagersSerializer(driver)
        return Response(serializer.data)

    def put(self, request, pk):
        try:
            driver = Managers.objects.get(user__username=pk)
        except Managers.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ManagersSerializer(driver, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        try:
            driver = Managers.objects.get(pk=pk)
        except Managers.DoesNotExist:
            return Response({"error": "Driver not found"}, status=status.HTTP_404_NOT_FOUND)

        driver.delete()
        return Response({"message": "Driver deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
def login_manager(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # User 모델 인증
    user = authenticate(request, username=username, password=password)

    if user is not None:
        try:
            # 해당 사용자가 Manager인지 확인
            manager = Managers.objects.get(user=user)
            role = 'manager'

            # JWT 토큰 생성
            refresh = RefreshToken.for_user(user)
            refresh['role'] = role  # role을 토큰에 추가
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            }, status=status.HTTP_200_OK)
        except Managers.DoesNotExist:
            return Response({"message": "Not a manager account"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        # Add custom claims to the access token
        user = self.user
        refresh = self.get_token(user)
        data['username'] = user.username
        data['role'] = user.managers.access_rigths if hasattr(user, 'managers') else 'driver'

        return data

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims to the refresh token
        token['username'] = user.username
        token['role'] = user.managers.access_rigths if hasattr(user, 'managers') else 'driver'

        return token


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
