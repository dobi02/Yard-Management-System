# Generated by Django 4.2.16 on 2024-12-03 02:44

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('drivers', '0001_initial'),
        ('managers', '0001_initial'),
        ('transactions', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='transactions',
            name='transaction_time',
        ),
        migrations.RemoveField(
            model_name='transactions',
            name='transaction_type',
        ),
        migrations.AddField(
            model_name='transactions',
            name='arrival_time',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='transactions',
            name='arrival_time_real',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='transactions',
            name='departure_time',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='transactions',
            name='departure_time_real',
            field=models.DateTimeField(null=True),
        ),
        migrations.AddField(
            model_name='transactions',
            name='manager_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='managers.managers'),
        ),
        migrations.AddField(
            model_name='transactions',
            name='transaction_created',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name='transactions',
            name='transaction_status',
            field=models.CharField(default='waiting', max_length=20),
        ),
        migrations.AddField(
            model_name='transactions',
            name='transaction_updated',
            field=models.DateTimeField(auto_now=True, null=True),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='driver_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.DO_NOTHING, to='drivers.drivers'),
        ),
        migrations.AlterField(
            model_name='transactions',
            name='transaction_id',
            field=models.AutoField(primary_key=True, serialize=False),
        ),
    ]
