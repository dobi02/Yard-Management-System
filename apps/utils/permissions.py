from rest_framework.permissions import BasePermission


class IsManager(BasePermission):
    def has_permission(self, request, view):
        return request.auth and request.auth.get('role') == 'manager'


class IsDriver(BasePermission):
    def has_permission(self, request, view):
        return request.auth and request.auth.get('role') == 'driver'
