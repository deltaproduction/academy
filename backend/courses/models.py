from django.db import models

from classes.models import Class
from users.models import Teacher, Student


class Course(models.Model):
    DRAFT = 0
    PUBLISHED = 1
    STATE_CHOICES = (
        (DRAFT, 'Черновик'),
        (PUBLISHED, 'Опубликован')
    )

    author = models.ForeignKey(Teacher, on_delete=models.PROTECT)

    title = models.CharField('Заголовок', max_length=150)
    state = models.PositiveSmallIntegerField('Опубликован', choices=STATE_CHOICES, default=DRAFT)
    description = models.TextField("Описание", max_length=1000)

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
    description = models.TextField("Описание", max_length=1000)

    start = models.DateTimeField('Дата окончания', null=True, blank=True)
    end = models.DateTimeField('Дата окончания', null=True, blank=True)

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'


class Task(models.Model):
    topic = models.ForeignKey(Topic, on_delete=models.CASCADE)

    title = models.CharField('Заголовок', max_length=150, blank=True)
    text = models.TextField('Текст', blank=True)

    format_in_text = models.TextField("Формат входных данных")
    format_out_text = models.TextField("Формат выходных данных")

    # autocheck = models.BooleanField('Авто-проверка', default=False)
    # stdin = models.TextField('stdin')
    # stdout = models.TextField('stdout')
    # samples = models.TextField('samples')
    # tests = models.TextField('tests')

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'


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
