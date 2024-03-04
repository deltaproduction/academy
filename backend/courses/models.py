from django.contrib.auth import get_user_model
from django.db import models

from classes.models import Class
from users.models import Teacher, Student

User = get_user_model()


class Course(models.Model):
    author = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    public = models.BooleanField("Опубликован", default=False)
    description = models.TextField("Описание", max_length=1000)
    state = models.IntegerField("Состояние")

    class Meta:
        verbose_name = "Курс"
        verbose_name_plural = "Курсы"


class Topic(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    description = models.TextField("Описание", max_length=1000)
    is_deleted = models.BooleanField("Удален", default=False)

    class Meta:
        verbose_name = "Тема"
        verbose_name_plural = "Темы"


class Task(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    title = models.CharField("Заголовок", max_length=150, blank=True)
    text = models.CharField("Текст", max_length=150, blank=True)
    autocheck = models.BooleanField("Автопроверка", default=False)
    format_in_text = models.TextField("Формат входных данных")
    format_out_text = models.TextField("Формат выходных данных")
    samples = models.TextField("Примеры")

    class Meta:
        verbose_name = "Задание"
        verbose_name_plural = "Задания"


class ClassCourse(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    class_field = models.ForeignKey(Class, on_delete=models.CASCADE)
    is_deleted = models.BooleanField("Удален", default=False)

    class Meta:
        verbose_name = "Курс класса"
        verbose_name_plural = "Курсы класса"


class TestCase(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    stdin = models.CharField("Входные данные", max_length=256)
    stdout = models.CharField("Выходные данные", max_length=256)
    timelimit = models.IntegerField("Ограничение по времени")
    ram_limit = models.IntegerField("Ограничение по памяти")

    class Meta:
        verbose_name = "Тест-кейс"
        verbose_name_plural = "Тест-кейсы"


class ClassCourseTopic(models.Model):
    class_course = models.ForeignKey(ClassCourse, on_delete=models.CASCADE)
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)
    opened = models.BooleanField("Открыт", default=False)
    deadline_at = models.DateTimeField("Дедлайн до")

    class Meta:
        verbose_name = "Тема курса класса"
        verbose_name_plural = "Темы курса класса"


class Attempt(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    code = models.TextField("Код решения")
    status = models.PositiveSmallIntegerField("Статус попытки")

    class Meta:
        verbose_name = "Попытка"
        verbose_name_plural = "Попытки"
