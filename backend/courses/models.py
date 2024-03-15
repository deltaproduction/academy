from django.db import models


class Course(models.Model):
    DRAFT = 0
    PUBLISHED = 1
    STATE_CHOICES = (
        (DRAFT, 'Черновик'),
        (PUBLISHED, 'Опубликован')
    )

    author = models.ForeignKey('users.Teacher', on_delete=models.PROTECT)

    title = models.CharField('Заголовок', max_length=150)
    state = models.PositiveSmallIntegerField('Опубликован', choices=STATE_CHOICES, default=DRAFT)
    description = models.TextField('Описание', null=True, blank=True)

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

    CLOSED = 0
    PUBLISHED = 1
    STATE_CHOICES = (
        (CLOSED, 'Закрыт'),
        (PUBLISHED, 'Опубликован')
    )

    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE)

    title = models.CharField('Заголовок', max_length=150, blank=True)
    type = models.PositiveSmallIntegerField('Тип', choices=TYPE_CHOICES, default=EDUCATIONAL)
    description = models.TextField('Описание', null=True, blank=True)

    state = models.PositiveSmallIntegerField('Опубликован', choices=STATE_CHOICES, default=CLOSED)

    start = models.DateTimeField('Дата окончания', null=True, blank=True)
    end = models.DateTimeField('Дата окончания', null=True, blank=True)

    class Meta:
        verbose_name = 'Тема'
        verbose_name_plural = 'Темы'


class Task(models.Model):
    topic = models.ForeignKey('courses.Topic', on_delete=models.CASCADE)

    title = models.CharField('Заголовок', max_length=150, blank=True)
    text = models.TextField('Текст', blank=True)

    format_in_text = models.TextField('Формат входных данных', null=True, blank=True)
    format_out_text = models.TextField('Формат выходных данных', null=True, blank=True)

    # autocheck = models.BooleanField('Авто-проверка', default=False)
    # stdin = models.TextField('stdin')
    # stdout = models.TextField('stdout')
    # samples = models.TextField('samples')
    # tests = models.TextField('tests')

    class Meta:
        verbose_name = 'Задание'
        verbose_name_plural = 'Задания'


class TestCase(models.Model):
    task = models.ForeignKey('courses.Task', on_delete=models.CASCADE)
    stdin = models.CharField('Входные данные', max_length=256)
    stdout = models.CharField('Выходные данные', max_length=256)
    timelimit = models.IntegerField('Ограничение по времени')
    ram_limit = models.IntegerField('Ограничение по памяти')

    class Meta:
        verbose_name = 'Тест-кейс'
        verbose_name_plural = 'Тест-кейсы'


class GroupCourseTopic(models.Model):
    class_course = models.ForeignKey('classes.GroupCourse', on_delete=models.CASCADE)
    topic = models.ForeignKey('courses.Topic', on_delete=models.CASCADE)
    opened = models.BooleanField('Открыт', default=False)
    deadline_at = models.DateTimeField('Дедлайн до')

    class Meta:
        verbose_name = 'Тема курса класса'
        verbose_name_plural = 'Темы курса класса'


class Attempt(models.Model):
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)
    task = models.ForeignKey('courses.Task', on_delete=models.CASCADE)
    code = models.TextField('Код решения')
    status = models.PositiveSmallIntegerField('Статус попытки')

    class Meta:
        verbose_name = 'Попытка'
        verbose_name_plural = 'Попытки'
