from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import Managers
from .serializers import ManagersSerializer
from rest_framework.permissions import IsAuthenticated


class ManagersView(APIView):
    #permission_classes = [IsAuthenticated]

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


