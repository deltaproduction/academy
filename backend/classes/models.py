from django.db import models

from courses.models import Course
from users.models import Student, Teacher


class Class(models.Model):
    title = models.CharField("Заголовок", max_length=150)
    tutor = models.ForeignKey(Teacher, on_delete=models.PROTECT)
    course = models.ForeignKey(Course, null=True, blank=True, on_delete=models.PROTECT)
    code = models.IntegerField("Код", unique=True)
    teacher_name = models.CharField("ФИО Учителя", max_length=150, blank=True)

    students = models.ManyToManyField(Student, through='classes.StudentClass', blank=True)

    class Meta:
        verbose_name = "Класс"
        verbose_name_plural = "Классы"


class StudentClass(models.Model):
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    class_ = models.ForeignKey(Class, null=True, on_delete=models.PROTECT)

    class Meta:
        verbose_name = "Класс ученика"
        verbose_name_plural = "Классы учеников"
