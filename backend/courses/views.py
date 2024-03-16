from django.contrib.auth import get_user_model
from rest_framework.generics import ListAPIView, get_object_or_404
from rest_framework.viewsets import ModelViewSet

from classes.models import Group, GroupStudent
from courses.models import Course, Topic
from courses.serializers import CourseListSerializer, CourseDetailSerializer, TopicSerializer

User = get_user_model()


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        try:
            return self.queryset.filter(author=self.request.user.teacher)
        except User.teacher.RelatedObjectDoesNotExist:
            return self.queryset.none()


class TopicsViewSet(ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        try:
            queryset = self.queryset.filter(course__author=self.request.user.teacher)

            course = self.request.query_params.get('course')

            if course:
                queryset = queryset.filter(course=course)
        except User.teacher.RelatedObjectDoesNotExist:
            return self.queryset.none()
        return queryset


class GroupTopicsListView(ListAPIView):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):

        if class_id := self.kwargs.get('class_id'):
            group = get_object_or_404(Group, id=class_id)
            queryset = self.queryset.filter(course=group.groupcourse.course)
        else:
            main_group = GroupStudent.objects.get(student=self.request.user.student, main=True).group
            queryset = self.queryset.filter(course=main_group.groupcourse.course)
        return queryset
