from django.contrib.auth import get_user_model
from django.http import JsonResponse
from djangorestframework_camel_case.util import camelize
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from classes.models import Group
from courses.models import Course, Topic, Task, TestCase, Attempt
from courses.serializers import (
    CourseListSerializer, CourseDetailSerializer, TopicSerializer,
    TaskSerializer, TaskListSerializer, TestCaseSerializer, AttemptSerializer
)
from users.serializers import StudentSerializer

User = get_user_model()


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        try:
            queryset = queryset.filter(author=self.request.user.teacher)
        except User.teacher.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        try:
            queryset = queryset.filter(groups__students=self.request.user.student)

            group = self.request.query_params.get('group')
            if group:
                queryset = queryset.filter(groups=group)
        except User.student.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        return queryset.none()


class TopicsViewSet(ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        course = self.request.query_params.get('course')

        if course:
            queryset = queryset.filter(course=course)

        try:
            queryset = queryset.filter(course__author=self.request.user.teacher)
        except User.teacher.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        try:
            queryset = queryset.filter(course__groups__students=self.request.user.student)
        except User.student.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        return queryset.none()


class TestCasesViewSet(ModelViewSet):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        task = self.request.query_params.get('task')

        if task:
            queryset = queryset.filter(task=task)

        try:
            queryset = queryset.filter(task__topic__course__author=self.request.user.teacher)
        except User.teacher.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        return queryset.none()


class TasksViewSet(ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_serializer_class(self):
        if self.action == 'list':
            return TaskListSerializer
        return super().get_serializer_class()

    def get_queryset(self):
        queryset = super().get_queryset()

        topic = self.request.query_params.get('topic')

        if topic:
            queryset = queryset.filter(topic=topic)

        try:
            queryset = queryset.filter(topic__course__author=self.request.user.teacher)
        except User.teacher.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        try:
            queryset = queryset.filter(topic__course__groups__students=self.request.user.student)
        except User.student.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        return queryset.none()


class AttemptsViewSet(ModelViewSet):
    queryset = Attempt.objects.all()
    serializer_class = AttemptSerializer

    def get_queryset(self):
        queryset = super().get_queryset()

        statuses = self.request.query_params.get('statuses')

        if statuses:
            queryset = queryset.filter(status__in=statuses.split(','))

        try:
            queryset = queryset.filter(
                task__topic__course__author=self.request.user.teacher,
                task__autoreview=Task.NO
            )
        except User.teacher.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        try:
            queryset = queryset.filter(student=self.request.user.student)
        except User.student.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        return queryset.none()


@api_view()
@permission_classes([IsAuthenticated])
def get_class_topic_ratings(request, class_id, topic_id):
    group = Group.objects.get(id=class_id)
    topic = Topic.objects.get(id=topic_id)

    result = []

    for student in group.students.all():
        studentResult = {
            'student': dict(StudentSerializer(student).data),
            'tasks': {}
        }
        for task in topic.tasks.all():
            attempt = Attempt.objects.filter(student=student, task=task)
            if attempt.exists():
                attempt = attempt.first()
                studentResult['tasks'][task.id] = dict(id=attempt.id, status=attempt.status)
        result.append(studentResult)

    return JsonResponse(camelize(result), safe=False)
