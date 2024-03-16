# Generated by Django 5.0.3 on 2024-03-15 12:33

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0008_groupcourse_alter_group_courses_delete_groupcourses'),
        ('courses', '0005_topic_state'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ClassCourseTopic',
            new_name='GroupCourseTopic',
        ),
        migrations.AlterField(
            model_name='groupcoursetopic',
            name='class_course',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classes.groupcourse'),
        ),
        migrations.DeleteModel(
            name='ClassCourse',
        ),
    ]