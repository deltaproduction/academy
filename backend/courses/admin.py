from django.contrib import admin

from .models import Course, Topic, Task, TestCase, Attempt, TopicAttachment

admin.site.register(Course)
admin.site.register(Topic)
admin.site.register(TopicAttachment)
admin.site.register(Task)
admin.site.register(TestCase)
admin.site.register(Attempt)
