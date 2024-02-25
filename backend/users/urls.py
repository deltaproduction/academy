from django.urls import path

from .views import profile, sign_in_view,sign_up_view

urlpatterns = [
    path('profile/', profile),
    path("sign_in/", sign_in_view),
    path("sign_up/", sign_up_view),
]
