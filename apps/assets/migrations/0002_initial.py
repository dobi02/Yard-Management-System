# Generated by Django 5.1.3 on 2024-11-18 11:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('assets', '0001_initial'),
        ('parking', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chassis',
            name='parked_place',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='parking.parkingslots'),
        ),
        migrations.AddField(
            model_name='containers',
            name='parked_place',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='parking.parkingslots'),
        ),
        migrations.AddField(
            model_name='trailers',
            name='parked_place',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='parking.parkingslots'),
        ),
        migrations.AddField(
            model_name='trucks',
            name='parked_place',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='parking.parkingslots'),
        ),
    ]