from django.contrib.auth import get_user_model
from django.db import models

User = get_user_model()


class Course(models.Model):
    DRAFT = 0
    PUBLISHED = 1
    STATE_CHOICES = (
        (DRAFT, 'Черновик'),
        (PUBLISHED, 'Опубликован')
    )

    author = models.ForeignKey(User, on_delete=models.PROTECT)

    title = models.CharField('Заголовок', max_length=150)
    state = models.PositiveSmallIntegerField('Опубликован', choices=STATE_CHOICES, default=DRAFT)

    class Meta:
        verbose_name = 'Курс'
        verbose_name_plural = 'Курсы'


class Topic(models.Model):
    EDUCATIONAL = 0
    CLASS_WORK = 1
    INDEPENDENT_WORK = 2
    TYPE_CHOICES = (
        (EDUCATIONAL, 'Учебная тема'),
        (CLASS_WORK, 'Классная работа'),
        (INDEPENDENT_WORK, 'Самостоятельная работа'),
    )

    course = models.ForeignKey(Course, on_delete=models.CASCADE)

    title = models.CharField('Заголовок', max_length=150, blank=True)
    type = models.PositiveSmallIntegerField('Тип', choices=TYPE_CHOICES, default=EDUCATIONAL)

    start = models.DateTimeField('Дата окончания', null=True, blank=True)
    end = models.DateTimeField('Дата окончания', null=True, blank=True)

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'


class Task(models.Model):

    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    title = models.CharField('Заголовок', max_length=150, blank=True)
    text = models.TextField('Текст', blank=True)
    # autocheck = models.BooleanField('Авто-проверка', default=False)
    # stdin = models.TextField('stdin')
    # stdout = models.TextField('stdout')
    # samples = models.TextField('samples')
    # tests = models.TextField('tests')

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'


class Solution(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    code = models.TextField('code')
    status = models.PositiveSmallIntegerField('status')

    class Meta:
        verbose_name = 'Решение'
        verbose_name_plural = 'Решения'
