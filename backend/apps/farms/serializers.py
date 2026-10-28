
from rest_framework import serializers
from .models import Farmer, Farm


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ["id", "name"]


class FarmSerializer(serializers.ModelSerializer):
    farmer_name = serializers.CharField(
        source="farmer.name",
        read_only=True,
    )

    class Meta:
        model = Farm
        fields = [
            "id",
            "farmer",
            "farmer_name",
            "area_ha",
            "district",
            "upazila",
            "land_type",
            "crop_code",
            "planting_date",
        ]
