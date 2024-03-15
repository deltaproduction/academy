from django.db import models


class Group(models.Model):
    title = models.CharField('Заголовок', max_length=150)
    tutor = models.ForeignKey('users.Teacher', on_delete=models.PROTECT)
    code = models.IntegerField('Код', unique=True)
    teacher_name = models.CharField('ФИО Учителя', max_length=150, blank=True)

    students = models.ManyToManyField('users.Student', through='classes.GroupStudent', related_name='student_groups')
    courses = models.ManyToManyField('courses.Course', through='classes.GroupCourse', related_name='course_groups')

    class Meta:
        verbose_name = 'Класс'
        verbose_name_plural = 'Классы'


class GroupStudent(models.Model):
    group = models.ForeignKey('classes.Group', on_delete=models.CASCADE)
    student = models.ForeignKey('users.Student', on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Ученик класса'
        verbose_name_plural = 'Ученики классов'
        unique_together = ('group', 'student')


class GroupCourse(models.Model):
    group = models.OneToOneField('classes.Group', on_delete=models.CASCADE)
    course = models.ForeignKey('courses.Course', on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Курс класса'
        verbose_name_plural = 'Курсы классов'
