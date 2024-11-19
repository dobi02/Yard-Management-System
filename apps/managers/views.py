from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Managers

@api_view(['POST'])
def login_manager(request):
    manager_id = request.data.get('manager_id')
    password = request.data.get('password')

    try:
        manager = Managers.objects.get(manager_id=manager_id)

        if manager.password_hash == password:
            return Response({"messsage": "Login successful"}, status=200)
        else:
            return Response({"messsage": "Invalid credentials"}, status=400)
    except Managers.DoesNotExist:
        return Response({"messsage": "Manager not found"}, status=404)

