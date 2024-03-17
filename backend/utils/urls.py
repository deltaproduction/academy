from django.urls import path

from utils.views import check_code_view

urlpatterns = [
    path("check_code/<int:task_id>/", check_code_view)
]
