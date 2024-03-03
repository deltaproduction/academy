from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from classes.models import Class
from classes.serializers import ClassSerializer


class ClassViewSet(ModelViewSet):
    queryset = Class.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = ClassSerializer

    def get_queryset(self):
        return self.queryset.filter(tutor=self.request.user)
