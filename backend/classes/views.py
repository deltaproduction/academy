from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from classes.models import Group
from classes.serializers import GroupListSerializer, GroupDetailSerializer
from users.models import Teacher, Student

from classes.serializers import GroupStudentCreateSerializer


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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_group_student(request):
    student = request.user.student
    group_student = GroupStudentCreateSerializer(data={
        "group": get_object_or_404(Group, code=request.data.get("code")).pk,
        "student": student.pk,
    })
    group_student.is_valid(raise_exception=True)
    student.groupstudent_set.update(main=False)
    group_student.save()

    return Response(group_student.data, status=status.HTTP_201_CREATED)
