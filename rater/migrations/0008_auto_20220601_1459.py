# Generated by Django 2.1.15 on 2022-06-01 14:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rater', '0007_auto_20220601_1441'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='people',
            unique_together={('first', 'middle', 'last', 'rank', 'email')},
        ),
    ]
