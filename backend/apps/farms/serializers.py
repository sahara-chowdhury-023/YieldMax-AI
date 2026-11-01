from decimal import Decimal

from rest_framework import serializers

from .models import Farmer, Farm


# Add other officially supported crop codes here.
VALID_CROP_CODES = {
    "boro_rice",
}


class FarmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Farmer
        fields = ["id", "name"]


class FarmSerializer(serializers.ModelSerializer):

    area_ha = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal("0.01"),
    )

    farmer_name = serializers.CharField(
        source="farmer.name",
        read_only=True,
    )

    crop_code = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
    )

    def validate_crop_code(self, value):
        if value not in VALID_CROP_CODES:
            raise serializers.ValidationError(
                "Invalid crop code. Supported crops: boro_rice."
            )
        return value

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
            "crop_stage",
        ]