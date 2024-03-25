from django.http import JsonResponse
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.generics import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from classes.models import Group
from classes.serializers import GroupListSerializer, GroupDetailSerializer
from courses.models import Topic
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
    group_student = GroupStudentCreateSerializer(data=request.data, context=dict(request=request))
    group_student.is_valid(raise_exception=True)
    student.groupstudent_set.update(main=False)
    group_student.save()

    return Response(group_student.data, status=status.HTTP_201_CREATED)


def get_edu_topic_tasks(self, n, type):
    return (1, 2)


def get_test_topic_tasks(self, n):
    return (3, 1)


def get_independent_topic_tasks(self, n):
    return (4, 2)


def get_course_edu_topics(self):
    courses_in_group = Group.objects.filter(id=13).values_list('course', flat=True)

    topics = Topic.objects.filter(course__in=courses_in_group, type=0).values_list('id', flat=True)

    return list(topics)


def get_course_test_topics(self):
    courses_in_group = Group.objects.filter(id=13).values_list('course', flat=True)

    topics = Topic.objects.filter(course__in=courses_in_group, type=1).values_list('id', flat=True)

    return list(topics)


def get_course_independent_topics(self):
    courses_in_group = Group.objects.filter(id=13).values_list('course', flat=True)

    topics = Topic.objects.filter(course__in=courses_in_group, type=2).values_list('id', flat=True)

    return list(topics)


def get_rating(self, obj):
    result = int()
    A, B, C, D, E = 0.2, 0.3, 0.5, 2, 3

    for n in self.get_course_edu_topics():
        simple_tasks_amout, simple_tasks_solved = self.get_edu_topic_tasks(n, 0)
        home_tasks_amout, home_tasks_solved = self.get_edu_topic_tasks(n, 1)
        hard_tasks_amout, hard_tasks_solved = self.get_edu_topic_tasks(n, 2)

        a, b, c = A / simple_tasks_amout, B / home_tasks_amout, C / hard_tasks_amout

        result += a * simple_tasks_solved + b * home_tasks_solved + c * hard_tasks_solved

    for n in self.get_course_test_topics():
        test_topic_tasks_amout, test_topic_tasks_solved = self.get_test_topic_tasks(n)

        d = D / test_topic_tasks_amout

        result += d * test_topic_tasks_solved

    for n in self.get_course_independent_topics():
        independent_topic_tasks_amout, independent_topic_tasks_solved = self.get_independent_topic_tasks(n)

        e = E / independent_topic_tasks_amout

        result += e * independent_topic_tasks_solved

    return round(result, 1)


def get_average(self, obj):
    return len(obj.user.last_name)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def get_group_rating(request):
    data = request.data
    group = data.get("group")

    response = {
        3: {
            'rating': 10,
            'average': 20
        }
    }

    return JsonResponse(response, safe=False)
