from django.contrib.auth import get_user_model
from django.db import models

from courses.models import Course
from users.models import Student

User = get_user_model()


class Class(models.Model):
    tutor = models.ForeignKey(User, null=True, on_delete=models.PROTECT)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    teacher_name = models.CharField("ФИО Учителя", max_length=150, blank=True)
    code = models.CharField("Код", max_length=7, blank=True)

    class Meta:
        verbose_name = "Класс"
        verbose_name_plural = "Классы"


class StudentClass(models.Model):
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_field = models.ForeignKey(Class, null=True, on_delete=models.PROTECT)
