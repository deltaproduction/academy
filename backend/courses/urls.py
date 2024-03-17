from rest_framework import routers

from courses.views import CourseViewSet, TopicsViewSet, TasksViewSet, TestCasesViewSet, AttemptsViewSet

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)
router.register(r'tasks', TasksViewSet)
router.register(r'test_cases', TestCasesViewSet)
router.register(r'attempts', AttemptsViewSet)

urlpatterns = router.urls
