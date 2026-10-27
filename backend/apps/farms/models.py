
from django.db import models


class Farmer(models.Model):
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name


class Farm(models.Model):
    farmer = models.ForeignKey(
        Farmer,
        on_delete=models.PROTECT,
        related_name="farms",
    )
    area_ha = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )
    district = models.CharField(max_length=100)
    upazila = models.CharField(max_length=100)
    land_type = models.CharField(max_length=50)
    crop_code = models.CharField(max_length=50)
    planting_date = models.DateField()

    def __str__(self):
        return f"{self.crop_code} - {self.district}"
