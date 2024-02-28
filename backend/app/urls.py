from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include([
        path('', include('users.urls')),
    ])),
    path('admin/', admin.site.urls),
]
