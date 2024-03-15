from django.contrib import admin

from .models import Course, Topic, Task, TestCase, GroupCourseTopic, Attempt

admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(Task)
admin.site.register(TestCase)
admin.site.register(GroupCourseTopic)
admin.site.register(Attempt)
