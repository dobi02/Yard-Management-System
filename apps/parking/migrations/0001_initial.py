# Generated by Django 5.1.3 on 2024-11-25 14:21

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ("sites", "0002_alter_domain_unique"),
    ]

    operations = [
        migrations.CreateModel(
            name="ParkingSlots",
            fields=[
                (
                    "slot_id",
                    models.CharField(max_length=14, primary_key=True, serialize=False),
                ),
                ("is_occupied", models.BooleanField(default=False)),
                (
                    "site_id",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="sites.site"
                    ),
                ),
            ],
            options={
                "db_table": "parking_slots",
            },
        ),
    ]
