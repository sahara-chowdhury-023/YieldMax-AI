
from django.db import models
from apps.farms.models import Farm


class Prediction(models.Model):
    farm = models.ForeignKey(
        Farm,
        on_delete=models.PROTECT,
        related_name="predictions",
    )
    market_price_bdt_per_kg = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    total_cost_bdt = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    baseline_yield_t_per_ha = models.DecimalField(
        max_digits=8,
        decimal_places=3,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prediction {self.id}"


class ScenarioResult(models.Model):
    SCENARIO_CHOICES = [
        ("normal", "Normal"),
        ("low_rain", "Low Rain"),
        ("heavy_rain", "Heavy Rain"),
    ]

    prediction = models.ForeignKey(
        Prediction,
        on_delete=models.CASCADE,
        related_name="scenarios",
    )
    scenario_code = models.CharField(
        max_length=20,
        choices=SCENARIO_CHOICES,
    )
    yield_t_per_ha = models.DecimalField(
        max_digits=8,
        decimal_places=3,
    )
    total_production_kg = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    revenue_bdt = models.DecimalField(
        max_digits=14,
        decimal_places=2,
    )
    total_cost_bdt = models.DecimalField(
        max_digits=12,
        decimal_places=2,
    )
    net_profit_bdt = models.DecimalField(
        max_digits=14,
        decimal_places=2,
    )

    def __str__(self):
        return f"{self.prediction_id} - {self.scenario_code}"
