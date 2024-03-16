from django.contrib.auth import get_user_model
from rest_framework.generics import get_object_or_404
from rest_framework.viewsets import ModelViewSet

from classes.models import Group, GroupStudent
from courses.models import Course, Topic, Task
from courses.serializers import CourseListSerializer, CourseDetailSerializer, GroupTopicSerializer, TopicSerializer, \
    TaskSerializer, TaskListSerializer

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


class TasksViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        try:
            queryset = self.queryset.filter(topic__course__author=self.request.user.teacher)

            topic = self.request.query_params.get('topic')

            if topic:
                queryset = queryset.filter(topic=topic)
        except User.teacher.RelatedObjectDoesNotExist:
            return self.queryset.none()
        return queryset


class GroupTopicsViewSet(ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = GroupTopicSerializer

    def get_queryset(self):
        group = self.request.query_params.get('class')
        course = self.request.query_params.get('course')

        if course:
            queryset = self.queryset.filter(course=course)
        elif group:
            group = get_object_or_404(Group, id=group)
            queryset = self.queryset.filter(course=group.groupcourse.course)
        else:
            main_group = GroupStudent.objects.get(student=self.request.user.student, main=True).group
            queryset = self.queryset.filter(course=main_group.groupcourse.course)
        return queryset
