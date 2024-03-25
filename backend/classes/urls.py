from django.urls import path
from rest_framework import routers

from classes.views import create_group_student, GroupViewSet, get_group_rating

router = routers.SimpleRouter()
router.register(r'groups', GroupViewSet)

urlpatterns = router.urls + [
    path("group_student/create/", create_group_student),
    path("get_student_rating/", get_group_rating)
]