from django.urls import path
from rest_framework import routers

from classes.views import create_group_student, GroupViewSet

router = routers.SimpleRouter()
router.register(r'groups', GroupViewSet)

urlpatterns = [
    path("group-student/create/", create_group_student)
]

urlpatterns += router.urls
