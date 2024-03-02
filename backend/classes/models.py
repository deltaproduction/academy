from django.contrib.auth import get_user_model
from django.db import models

from courses.models import Course

User = get_user_model()


class Class(models.Model):
    tutor = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    course = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    teacher_name = models.CharField("ФИО Учителя", max_length=150, blank=True)
    code = models.CharField("Код", max_length=7, blank=True)

    class Meta:
        verbose_name = "Класс"
        verbose_name_plural = "Классы"
