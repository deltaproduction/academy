from django.urls import path
from rest_framework import routers

from courses.views import CourseViewSet, TopicsViewSet, GroupTopicsListView

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)

urlpatterns = [
    path(r'class_topics/', GroupTopicsListView.as_view()),
    path(r'class_topics/<int:class_id>/', GroupTopicsListView.as_view())
]
urlpatterns += router.urls
