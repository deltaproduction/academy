from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('api/', include([
        path('', include('courses.urls')),
        path('', include('classes.urls')),
        path('', include('users.urls')),
        path('', include('utils.urls')),
    ])),
    path('admin/', admin.site.urls),
]
