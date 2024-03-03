from django.contrib.auth import get_user_model
from django.db import models

from courses.models import Course

User = get_user_model()


class Class(models.Model):
    title = models.CharField("Заголовок", max_length=150, blank=True)
    tutor = models.ForeignKey(User, null=True, on_delete=models.PROTECT)
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.PROTECT)
    code = models.IntegerField("Код", blank=True)

    class Meta:
        verbose_name = "Класс"
        verbose_name_plural = "Классы"
