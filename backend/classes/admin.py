from django.contrib import admin

from classes.models import Group, GroupStudent, GroupCourse

admin.site.register(Group)
admin.site.register(GroupStudent)
admin.site.register(GroupCourse)
