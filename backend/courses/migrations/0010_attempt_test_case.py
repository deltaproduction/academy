# Generated by Django 5.0.3 on 2024-03-17 20:47

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0009_attempt_output_alter_attempt_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='attempt',
            name='test_case',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='courses.testcase'),
        ),
    ]
