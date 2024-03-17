from rest_framework import routers

from courses.views import CourseViewSet, TopicsViewSet, GroupTopicsViewSet, TasksViewSet

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)
router.register(r'tasks', TasksViewSet)
router.register(r'class_topics', GroupTopicsViewSet)

urlpatterns = router.urls
