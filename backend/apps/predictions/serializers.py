
from rest_framework import serializers
from .models import Prediction, ScenarioResult


class PredictionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prediction
        fields = [
            "id",
            "farm",
            "market_price_bdt_per_kg",
            "total_cost_bdt",
            "baseline_yield_t_per_ha",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]


class ScenarioResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScenarioResult
        fields = [
            "id",
            "prediction",
            "scenario_code",
            "yield_t_per_ha",
            "total_production_kg",
            "revenue_bdt",
            "total_cost_bdt",
            "net_profit_bdt",
        ]
        read_only_fields = ["id"]
