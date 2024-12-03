# Generated by Django 4.2.16 on 2024-12-03 02:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('assets', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='chassis',
            name='chassis_id',
            field=models.CharField(editable=False, max_length=6, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='containers',
            name='container_id',
            field=models.CharField(editable=False, max_length=6, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='trailers',
            name='trailer_id',
            field=models.CharField(editable=False, max_length=6, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='trucks',
            name='truck_id',
            field=models.CharField(editable=False, max_length=6, primary_key=True, serialize=False),
        ),
    ]
