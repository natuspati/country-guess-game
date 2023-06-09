# Generated by Django 4.2.1 on 2023-06-08 16:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('game', '0003_remove_userstats_id_alter_userstats_session'),
    ]

    operations = [
        migrations.AddField(
            model_name='userstats',
            name='last_game_state',
            field=models.CharField(choices=[('success', 'succes'), ('fail', 'fail'), ('wait', 'wait')], default='wait', max_length=10),
        ),
        migrations.AddField(
            model_name='userstats',
            name='last_number_tries',
            field=models.IntegerField(default=4),
        ),
    ]