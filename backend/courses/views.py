from django.contrib.auth import get_user_model
from django.http import JsonResponse
from djangorestframework_camel_case.util import camelize
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.mixins import CreateModelMixin, DestroyModelMixin
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet, GenericViewSet

from classes.models import Group
from courses.models import Course, Topic, Task, TestCase, Attempt, TopicAttachment, StudentTopic
from courses.serializers import (
    CourseListSerializer, CourseDetailSerializer, TopicSerializer,
    TaskSerializer, TaskListSerializer, TestCaseSerializer, AttemptSerializer, TopicAttachmentSerializer
)
from users.serializers import StudentSerializer
from utils.code_runner import run_code_with_timeout

User = get_user_model()


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['POST'])
    def upload_file(self, request, pk, *args, **kwargs):
        serializer = TopicAttachmentSerializer(data=request.data, context=dict(topic=pk))
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    @action(detail=True, methods=['POST'])
    def start_task(self, request, pk, *args, **kwargs):
        student = request.user.student
        student_topic, created = StudentTopic.objects.get_or_create(topic_id=pk, student=student)
        return JsonResponse(dict(started_at=student_topic.started_at), status=201 if created else 200)

    def get_queryset(self):
        queryset = super().get_queryset()

        course = self.request.query_params.get('course')
        group = self.request.query_params.get('group')

        if course:
            queryset = queryset.filter(course=course)

        if group:
            queryset = queryset.filter(course__groups=group)

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


class TopicAttachmentsViewSet(GenericViewSet, DestroyModelMixin):
    queryset = TopicAttachment.objects.all()
    permission_classes = [IsAuthenticated]


class TestCasesViewSet(ModelViewSet):
    queryset = TestCase.objects.all()
    serializer_class = TestCaseSerializer
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

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
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        statuses = self.request.query_params.get('statuses')

        if statuses:
            queryset = queryset.filter(status__in=statuses.split(','))
            print(1, queryset)

        task = self.request.query_params.get('task')
        topic = self.request.query_params.get('topic')
        only_manual = self.request.query_params.get('only_manual')

        if task:
            queryset = queryset.filter(task_id=task)
            print(2, queryset)

        if topic:
            queryset = queryset.filter(task__topic=topic)
            print(2, queryset)

        try:
            print(4)
            if only_manual:
                queryset = queryset.filter(
                    task__topic__course__author=self.request.user.teacher,
                    task__autoreview=Task.NO
                )
                print(5, queryset)
            else:
                queryset = queryset.filter(
                    task__topic__course__author=self.request.user.teacher
                )
                print(6, queryset)
        except User.teacher.RelatedObjectDoesNotExist:
            pass
        else:
            return queryset

        try:
            queryset = queryset.filter(student=self.request.user.student)
            print(7, queryset)
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


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def run_code(request):
    success, output = run_code_with_timeout(
        request.POST.get('code'), request.POST.get('stdin'), 2
    )
    return JsonResponse({"success": success, "output": output}, safe=False)
