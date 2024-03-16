from django.urls import path
from rest_framework import routers

from courses.views import CourseViewSet, TopicsViewSet, GroupTopicsViewSet

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)
router.register(r'class_topics', GroupTopicsViewSet)

urlpatterns = router.urls
