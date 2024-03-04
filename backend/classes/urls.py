from rest_framework import routers

from classes.views import GroupViewSet

router = routers.SimpleRouter()
router.register(r'groups', GroupViewSet)

urlpatterns = router.urls
