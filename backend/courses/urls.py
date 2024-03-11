from rest_framework import routers

from courses.views import CourseViewSet, TopicsViewSet

router = routers.SimpleRouter()
router.register(r'courses', CourseViewSet)
router.register(r'topics', TopicsViewSet)

urlpatterns = router.urls
