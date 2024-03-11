from rest_framework.viewsets import ModelViewSet

from courses.models import Course, Topic
from courses.serializers import CourseListSerializer, CourseDetailSerializer, TopicSerializer


class CourseViewSet(ModelViewSet):
    queryset = Course.objects.all()

    def get_serializer_class(self):
        if self.action == 'list':
            return CourseListSerializer
        return CourseDetailSerializer

    def get_queryset(self):
        if self.request.user.teacher:
            return self.queryset.filter(author=self.request.user.teacher)
        return self.queryset.none()


class TopicsViewSet(ModelViewSet):
    queryset = Topic.objects.all()
    serializer_class = TopicSerializer

    def get_queryset(self):
        if not self.request.user.teacher:
            return self.queryset.none()

        queryset = self.queryset.filter(course__author=self.request.user.teacher)

        course = self.request.query_params.get('course')

        if course:
            queryset = queryset.filter(course=course)

        return queryset
