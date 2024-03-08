from rest_framework.permissions import BasePermission, IsAuthenticated


class IsTeacherAuthenticated(IsAuthenticated):

    def has_permission(self, request, view):
        return super().has_permission(request, view) and bool(request.user.teacher)


class IsStudentAuthenticated(IsAuthenticated):

    def has_permission(self, request, view):
        return super().has_permission(request, view) and bool(request.user.teacher)
