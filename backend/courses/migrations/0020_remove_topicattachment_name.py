# Generated by Django 5.0.3 on 2024-03-23 11:35

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('courses', '0019_topicattachment'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='topicattachment',
            name='name',
        ),
    ]