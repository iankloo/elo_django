# Generated by Django 3.2.13 on 2022-07-13 17:32

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('rater', '0019_experiment_rate_self'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comments',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('comment', models.TextField(max_length=500)),
                ('experiment_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='rater.experiment')),
                ('rater_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='rater_name', to='rater.people')),
                ('subject_name', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='subject_name', to='rater.people')),
            ],
            options={
                'verbose_name_plural': 'comments',
            },
        ),
    ]