from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Course(models.Model):
    tutor = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    public = models.BooleanField("Опубликован", default=False)

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"


class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    deadline = models.DateTimeField()
    type = models.PositiveSmallIntegerField("Тип")

    class Meta:
        verbose_name = "Тема"
        verbose_name_plural = "Темы"


class Task(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    text = models.CharField("Текст", max_length=150, blank=True)
    autocheck = models.BooleanField("autocheck", default=False)
    stdin = models.TextField("stdin")
    stdout = models.TextField("stdout")
    samples = models.TextField("samples")
    tests = models.TextField("tests")

    class Meta:
        verbose_name = "Задание"
        verbose_name_plural = "Задания"


class Solution(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    code = models.TextField("code")
    status = models.PositiveSmallIntegerField("status")

    class Meta:
        verbose_name = "Решение"
        verbose_name_plural = "Решения"
