from rest_framework import routers

from classes.views import ClassViewSet

router = routers.SimpleRouter()
router.register(r'classes', ClassViewSet)

urlpatterns = router.urls
