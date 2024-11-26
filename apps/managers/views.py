from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import managers

@api_view(['POST'])
def login_manager(request):
    username = request.data.get('username')
    password = request.data.get('password')

    # User 모델 인증
    user = authenticate(request, username=username, password=password)

    if user is not None:
        try:
            # 해당 사용자가 Manager인지 확인
            manager = managers.objects.get(user=user)

            # JWT 토큰 생성
            refresh = RefreshToken.for_user(user)
            return Response({
                "message": "Login successful",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "name": manager.name
            }, status=status.HTTP_200_OK)
        except managers.DoesNotExist:
            return Response({"message": "Not a manager account"}, status=status.HTTP_403_FORBIDDEN)
    else:
        return Response({"message": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)

