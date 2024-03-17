# Generated by Django 5.0.3 on 2024-03-17 09:14

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('classes', '0011_groupstudent_alter_main'),
    ]

    operations = [
        migrations.AddField(
            model_name='groupcourse',
            name='active',
            field=models.BooleanField(default=True, verbose_name='Активен'),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='groupcourse',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='classes.group'),
        ),
    ]