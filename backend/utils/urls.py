from django.urls import path

from utils.views import LoginView

urlpatterns = [
    path("login/", LoginView.as_view(), name="token_obtain_pair"),
]
