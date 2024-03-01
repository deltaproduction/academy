from django.db import models
from django.utils.translation import gettext_lazy as _

from users.models import User


class Course:
    tutor = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(_("title"), max_length=150, blank=True)
    public = models.BooleanField(_("public"), default=False)

    class Meta:
        verbose_name = _("course")
        verbose_name_plural = _("courses")


class Theme:
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    title = models.CharField(_("title"), max_length=150, blank=True)
    deadline = models.DateTimeField()
    type = models.PositiveSmallIntegerField(_("type"))

    class Meta:
        verbose_name = _("theme")
        verbose_name_plural = _("themes")


class Task:
    theme = models.ForeignKey(Theme, on_delete=models.CASCADE)
    title = models.CharField(_("title"), max_length=150, blank=True)
    text = models.CharField(_("text"), max_length=150, blank=True)
    autocheck = models.BooleanField(_("autocheck"), default=False)
    stdin = models.TextField(_("stdin"))
    stdout = models.TextField(_("stdout"))
    samples = models.TextField(_("samples"))
    tests = models.TextField(_("tests"))

    class Meta:
        verbose_name = _("task")
        verbose_name_plural = _("tasks")


class Solution:
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    code = models.TextField(_("code"))
    status = models.PositiveSmallIntegerField(_("status"))

    class Meta:
        verbose_name = _("solution")
        verbose_name_plural = _("solutions")



