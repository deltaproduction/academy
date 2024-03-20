from django.contrib import admin

from .models import Course, Topic, Task, TestCase, Attempt

admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(Task)
admin.site.register(TestCase)
admin.site.register(Attempt)
