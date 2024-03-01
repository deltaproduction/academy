from django.db import models
from django.utils.translation import gettext_lazy as _

from courses.models import Course
from users.models import User


class Class:
    tutor = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL)
    title = models.CharField(_("title"), max_length=150, blank=True)
    teacher_name = models.CharField(_("teacher name"), max_length=150, blank=True)
    code = models.CharField(_("code"), max_length=7, blank=True)

    class Meta:
        verbose_name = _("class")
        verbose_name_plural = _("classes")

