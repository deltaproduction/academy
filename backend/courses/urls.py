from django.urls import path
from rest_framework import routers

from courses.views import CourseViewSet, TopicsViewSet, TasksViewSet, TestCasesViewSet, AttemptsViewSet, get_class_topic_ratings

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)
router.register(r'tasks', TasksViewSet)
router.register(r'test_cases', TestCasesViewSet)
router.register(r'attempts', AttemptsViewSet)

urlpatterns = [
    path("ratings/<int:class_id>/<int:topic_id>/", get_class_topic_ratings)
] + router.urls
