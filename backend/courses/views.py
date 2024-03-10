from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet

from courses.models import Course
from courses.serializers import CourseListSerializer, CourseDetailSerializer


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
