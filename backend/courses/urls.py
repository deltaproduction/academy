from django.urls import path
from rest_framework import routers

from courses.views import (CourseViewSet, TopicsViewSet, TasksViewSet, TestCasesViewSet, TopicAttachmentsViewSet,
                           AttemptsViewSet, get_class_topic_ratings, run_code)

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)
router.register(r'topic_attachments', TopicAttachmentsViewSet)
router.register(r'tasks', TasksViewSet)
router.register(r'test_cases', TestCasesViewSet)
router.register(r'attempts', AttemptsViewSet)

urlpatterns = router.urls + [
    path("ratings/<int:class_id>/<int:topic_id>/", get_class_topic_ratings),
    path("run_code/", run_code),
]
