# Generated by Django 2.1.15 on 2022-06-01 16:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rater', '0010_auto_20220601_1500'),
    ]

    operations = [
        migrations.AlterField(
            model_name='people',
            name='email',
            field=models.CharField(blank=True, max_length=60, null=True, unique=True),
        ),
    ]