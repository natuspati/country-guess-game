# Generated by Django 4.2.1 on 2023-06-08 16:06

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('sessions', '0001_initial'),
        ('game', '0002_userstats'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userstats',
            name='id',
        ),
        migrations.AlterField(
            model_name='userstats',
            name='session',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to='sessions.session'),
        ),
    ]
