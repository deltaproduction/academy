# Generated by Django 5.0.3 on 2024-03-15 12:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_student_is_active_teacher_is_active_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='student',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='teacher',
            name='is_active',
            field=models.BooleanField(default=False),
        ),
    ]