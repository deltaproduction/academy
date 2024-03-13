from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from classes.models import Group
from classes.serializers import GroupListSerializer, GroupDetailSerializer
from users.models import Teacher, Student


class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return GroupListSerializer
        return GroupDetailSerializer

    def get_queryset(self):
        if Teacher.objects.filter(user=self.request.user).exists():
            return self.queryset.filter(tutor=self.request.user.teacher)
        if Student.objects.filter(user=self.request.user).exists():
            return self.queryset.filter(students=self.request.user.student)
        return self.queryset.none()
