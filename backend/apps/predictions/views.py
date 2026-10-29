
from django.db import transaction
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.farms.models import Farmer, Farm
from .models import Prediction, ScenarioResult
from .serializers import PredictionSerializer, ScenarioResultSerializer
from services.calculations import (
    validate_crop_code,
    calculate_profit,
    BASELINE_YIELD_T_PER_HA,
)

SCENARIO_MULTIPLIERS = {
    "normal": 1.0,
    "low_rain": 0.8,
    "heavy_rain": 0.9,
}


@api_view(["POST"])
def predictions_api(request):
    data = request.data

    required_fields = [
        "farmer_name",
        "area_ha",
        "district",
        "upazila",
        "land_type",
        "crop_code",
        "planting_date",
        "market_price_bdt_per_kg",
        "total_cost_bdt",
    ]

    missing_fields = [
        field for field in required_fields
        if field not in data
    ]

    if missing_fields:
        return Response(
            {
                "success": False,
                "error": "Missing required fields",
                "fields": missing_fields,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        area_ha = float(data["area_ha"])
        price = float(data["market_price_bdt_per_kg"])
        total_cost = float(data["total_cost_bdt"])

        if area_ha <= 0 or price < 0 or total_cost < 0:
            raise ValueError("Invalid numeric values")

        validate_crop_code(data["crop_code"])  # raises ValueError if unsupported
        base_yield = BASELINE_YIELD_T_PER_HA

    except (ValueError, TypeError):
        return Response(
            {
                "success": False,
                "error": "Invalid crop code or numeric values",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        with transaction.atomic():
            farmer = Farmer.objects.create(
                name=data["farmer_name"]
            )

            farm = Farm.objects.create(
                farmer=farmer,
                area_ha=area_ha,
                district=data["district"],
                upazila=data["upazila"],
                land_type=data["land_type"],
                crop_code=data["crop_code"],
                planting_date=data["planting_date"],
            )

            prediction = Prediction.objects.create(
                farm=farm,
                market_price_bdt_per_kg=price,
                total_cost_bdt=total_cost,
                baseline_yield_t_per_ha=base_yield,
            )

            scenario_codes = [
                "normal",
                "low_rain",
                "heavy_rain",
            ]

            for scenario_code in scenario_codes:
                scenario_yield = round(base_yield * SCENARIO_MULTIPLIERS[scenario_code], 3)

                result = calculate_profit(
                    area_ha=area_ha,
                    yield_t_per_ha=scenario_yield,
                    market_price_bdt_per_kg=price,
                    total_cost_bdt=total_cost,
                    crop_code=data["crop_code"],
                )

                ScenarioResult.objects.create(
                    prediction=prediction,
                    scenario_code=scenario_code,
                    yield_t_per_ha=scenario_yield,
                    total_production_kg=result["total_production_kg"],
                    revenue_bdt=result["revenue_bdt"],
                    total_cost_bdt=result["total_cost_bdt"],
                    net_profit_bdt=result["net_profit_bdt"],
                )

    except Exception:
        return Response(
            {
                "success": False,
                "error": "Could not create prediction. Check the input data.",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    scenarios = ScenarioResult.objects.filter(
        prediction=prediction
    ).order_by("id")

    return Response(
        {
            "success": True,
            "prediction_id": prediction.id,
            "farmer_name": farmer.name,
            "crop_code": farm.crop_code,
            "farm": {
                "area_ha": float(farm.area_ha),
                "district": farm.district,
                "upazila": farm.upazila,
            },
            "currency": "BDT",
            "scenarios": [
                {
                    "scenario_code": scenario.scenario_code,
                    "yield_t_per_ha": float(scenario.yield_t_per_ha),
                    "total_production_kg": float(
                        scenario.total_production_kg
                    ),
                    "revenue_bdt": float(scenario.revenue_bdt),
                    "total_cost_bdt": float(scenario.total_cost_bdt),
                    "net_profit_bdt": float(scenario.net_profit_bdt),
                }
                for scenario in scenarios
            ],
            "is_prototype_estimate": True,
        },
        status=status.HTTP_201_CREATED,
    )


@api_view(["GET"])
def prediction_detail(request, pk):
    try:
        prediction = Prediction.objects.select_related(
            "farm", "farm__farmer"
        ).get(pk=pk)
    except Prediction.DoesNotExist:
        return Response(
            {"error": "Prediction not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    scenarios = ScenarioResult.objects.filter(
        prediction=prediction
    ).order_by("id")

    return Response(
        {
            "prediction": PredictionSerializer(prediction).data,
            "farmer_name": prediction.farm.farmer.name,
            "crop_code": prediction.farm.crop_code,
            "scenarios": ScenarioResultSerializer(
                scenarios, many=True
            ).data,
        },
        status=status.HTTP_200_OK,
    )

@api_view(["POST"])
def economics_calculate(request):
    data = request.data

    required_fields = [
        "area_ha",
        "yield_t_per_ha",
        "market_price_bdt_per_kg",
        "total_cost_bdt",
    ]

    missing_fields = [
        field for field in required_fields
        if field not in data
    ]

    if missing_fields:
        return Response(
            {
                "success": False,
                "error": "Missing required fields",
                "fields": missing_fields,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        area_ha = float(data["area_ha"])
        yield_t_per_ha = float(data["yield_t_per_ha"])
        price = float(data["market_price_bdt_per_kg"])
        total_cost = float(data["total_cost_bdt"])

        if (
            area_ha <= 0
            or yield_t_per_ha < 0
            or price < 0
            or total_cost < 0
        ):
            raise ValueError("Invalid numeric values")

        result = calculate_profit(
            area_ha=area_ha,
            yield_t_per_ha=yield_t_per_ha,
            market_price_bdt_per_kg=price,
            total_cost_bdt=total_cost,
        )

    except (ValueError, TypeError):
        return Response(
            {
                "success": False,
                "error": "Invalid numeric values",
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return Response(
        {
            "success": True,
            "currency": "BDT",
            "area_ha": area_ha,
            "yield_t_per_ha": yield_t_per_ha,
            **result,
            "is_prototype_estimate": True,
        },
        status=status.HTTP_200_OK,
    )
