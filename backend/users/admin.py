from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as UserAdmin_
from django.contrib.auth.forms import UserChangeForm, UserCreationForm, AdminPasswordChangeForm
from django.utils.translation import gettext_lazy as _

from users.models import Teacher, Student

User = get_user_model()


class TeacherInline(admin.TabularInline):
    model = Teacher
    extra = 0


class StudentInline(admin.TabularInline):
    model = Student
    extra = 0


@admin.register(User)
class UserAdmin(UserAdmin_):
    add_form_template = "admin/auth/user/add_form.html"
    change_user_password_template = None
    fieldsets = (
        (None, {"fields": ("email", "password")}),
        (_("Personal info"), {"fields": ("last_name", "first_name", "middle_name")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "password1", "password2"),
            },
        ),
    )
    inlines = (TeacherInline, StudentInline)
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    list_display = ("email", "first_name", "last_name", "is_staff")
    list_filter = ("is_staff", "is_superuser", "is_active", "groups")
    search_fields = ("first_name", "last_name", "email")
    ordering = ("email",)
    filter_horizontal = (
        "groups",
        "user_permissions",
    )
