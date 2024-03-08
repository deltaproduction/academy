from django.contrib import admin

from .models import Course, Topic, Task, ClassCourse, TestCase, ClassCourseTopic, Attempt

admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(Task)
admin.site.register(TestCase)
admin.site.register(ClassCourse)
admin.site.register(ClassCourseTopic)
admin.site.register(Attempt)
