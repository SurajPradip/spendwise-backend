# Generated by Django 4.1.13 on 2024-05-30 20:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mongo_micro_1", "0002_spendwisebasicdetails"),
    ]

    operations = [
        migrations.AlterField(
            model_name="spendwisebasicdetails",
            name="date",
            field=models.DateField(),
        ),
    ]
