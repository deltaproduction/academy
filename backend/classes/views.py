from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from classes.models import Group
from classes.serializers import GroupSerializer


class GroupViewSet(ModelViewSet):
    queryset = Group.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = GroupSerializer

    def get_queryset(self):
        return self.queryset.filter(tutor=self.request.user)
