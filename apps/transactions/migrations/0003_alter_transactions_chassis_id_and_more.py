# Generated by Django 5.1.3 on 2024-12-14 17:11

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("assets", "0004_remove_trailers_type_containers_type"),
        ("drivers", "0002_drivers_state"),
        ("managers", "0001_initial"),
        ("places", "0002_yards_is_deleted_alter_yards_division_id"),
        ("transactions", "0002_remove_transactions_transaction_time_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="transactions",
            name="chassis_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="assets.chassis",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="container_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="assets.containers",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="destination_yard_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="destination_yard_id",
                to="places.yards",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="driver_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="drivers.drivers",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="manager_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="managers.managers",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="origin_yard_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="origin_yard_id",
                to="places.yards",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="trailer_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="assets.trailers",
            ),
        ),
        migrations.AlterField(
            model_name="transactions",
            name="truck_id",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="assets.trucks",
            ),
        ),
    ]
