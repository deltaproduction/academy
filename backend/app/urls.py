from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include([
        path('', include('utils.urls')),
        path('', include('users.urls')),
    ])),
    path('', include("rest_framework.urls", namespace="rest_framework")),
    path('admin/', admin.site.urls),
]
