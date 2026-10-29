"""
YieldMax V1 — Core Agricultural Calculation Engine (backend/services/calculations.py)
Owner: Member A (Team Lead & Calculation Engine Developer)

Golden Rule:
    Python calculates, the LLM only explains.
    All values produced in V1 are illustrative prototype estimates, NOT validated weather forecasts.
"""

from datetime import date
from typing import Any, Dict, List, Optional, Union

Number = Union[int, float]

# V1 Constants & Illustrative Prototype Assumptions


SUPPORTED_CROPS = {"boro_rice"}

BASELINE_YIELD_T_PER_HA: float = 5.0

SCENARIO_DEFINITIONS: List[Dict[str, Any]] = [
    {
        "scenario_code": "normal",
        "label": "Normal",
        "yield_multiplier": 1.0,
        "yield_t_per_ha": 5.0,
        "description": "Baseline normal weather assumption (100% of baseline yield).",
    },
    {
        "scenario_code": "low_rain",
        "label": "Low Rain",
        "yield_multiplier": 0.8,
        "yield_t_per_ha": 4.0,
        "description": "Illustrative low-rainfall scenario (-20% yield vs baseline).",
    },
    {
        "scenario_code": "heavy_rain",
        "label": "Heavy Rain",
        "yield_multiplier": 0.9,
        "yield_t_per_ha": 4.5,
        "description": "Illustrative heavy-rainfall scenario (-10% yield vs baseline).",
    },
]

V1_ASSUMPTIONS_METADATA: Dict[str, Any] = {
    "method_version": "v1",
    "estimation_method": "rule_based_baseline",
    "is_prototype_estimate": True,
    "currency": "BDT",
    "supported_crops": list(SUPPORTED_CROPS),
    "baseline_yield_t_per_ha": BASELINE_YIELD_T_PER_HA,
    "disclaimer": (
        "Illustrative prototype assumptions for Boro rice, not validated "
        "agricultural or weather-based forecasts."
    ),
}



# Validation Helpers

def validate_crop_code(crop_code: str) -> str:
    """Validate that the crop code is supported in V1 (boro_rice only)."""
    if not isinstance(crop_code, str) or not crop_code.strip():
        raise ValueError("crop_code must be a non-empty string.")
    normalized = crop_code.strip().lower()
    if normalized not in SUPPORTED_CROPS:
        raise ValueError(
            f"Unsupported crop_code '{crop_code}'. V1 only supports: {sorted(SUPPORTED_CROPS)}."
        )
    return normalized


def _validate_non_negative(value: Number, field_name: str) -> float:
    """Ensure a numeric input is a valid non-negative int or float (not bool)."""
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise TypeError(f"{field_name} must be a number (int or float).")
    if value < 0:
        raise ValueError(f"{field_name} cannot be negative (got {value}).")
    return float(value)


def _normalize_number(value: float) -> Number:
    """Return int if the float is an exact whole number, otherwise rounded float."""
    rounded = round(value, 2)
    if rounded.is_integer():
        return int(rounded)
    return rounded



# Core V1 Calculation Functions


def calculate_yield(
    area_ha: Number,
    yield_t_per_ha: Number = BASELINE_YIELD_T_PER_HA,
    crop_code: str = "boro_rice",
) -> Number:
    """
    Estimate total production in kilograms (kg) based on farm area (ha) and yield (t/ha).

    Formula:
        total_production_kg = area_ha * yield_t_per_ha * 1000
    """
    validate_crop_code(crop_code)
    area = _validate_non_negative(area_ha, "area_ha")
    yield_rate = _validate_non_negative(yield_t_per_ha, "yield_t_per_ha")

    total_production_kg = area * yield_rate * 1000.0
    return _normalize_number(total_production_kg)


def calculate_profit(
    area_ha: Number,
    yield_t_per_ha: Number,
    market_price_bdt_per_kg: Number,
    total_cost_bdt: Number,
    crop_code: str = "boro_rice",
) -> Dict[str, Number]:
    """
    Calculate total production (kg), revenue (BDT), total cost (BDT), and net profit (BDT).

    Formulas:
        total_production_kg = area_ha * yield_t_per_ha * 1000
        revenue_bdt = total_production_kg * market_price_bdt_per_kg
        net_profit_bdt = revenue_bdt - total_cost_bdt
    """
    validate_crop_code(crop_code)
    area = _validate_non_negative(area_ha, "area_ha")
    yield_rate = _validate_non_negative(yield_t_per_ha, "yield_t_per_ha")
    price = _validate_non_negative(market_price_bdt_per_kg, "market_price_bdt_per_kg")
    cost = _validate_non_negative(total_cost_bdt, "total_cost_bdt")

    total_production_kg = calculate_yield(
        area_ha=area,
        yield_t_per_ha=yield_rate,
        crop_code=crop_code,
    )
    revenue_bdt = float(total_production_kg) * price
    net_profit_bdt = revenue_bdt - cost

    return {
        "yield_t_per_ha": round(yield_rate, 2),
        "total_production_kg": _normalize_number(float(total_production_kg)),
        "revenue_bdt": _normalize_number(revenue_bdt),
        "total_cost_bdt": _normalize_number(cost),
        "net_profit_bdt": _normalize_number(net_profit_bdt),
    }


def calculate_scenarios(
    area_ha: Number,
    market_price_bdt_per_kg: Number,
    total_cost_bdt: Number,
    crop_code: str = "boro_rice",
    baseline_yield_t_per_ha: Number = BASELINE_YIELD_T_PER_HA,
) -> List[Dict[str, Any]]:
    """
    Calculate production, revenue, total cost, and net profit across the three
    V1 scenarios: normal (5.0 t/ha), low_rain (4.0 t/ha), and heavy_rain (4.5 t/ha).
    """
    validate_crop_code(crop_code)
    area = _validate_non_negative(area_ha, "area_ha")
    price = _validate_non_negative(market_price_bdt_per_kg, "market_price_bdt_per_kg")
    cost = _validate_non_negative(total_cost_bdt, "total_cost_bdt")
    base_yield = _validate_non_negative(baseline_yield_t_per_ha, "baseline_yield_t_per_ha")

    scenarios_output: List[Dict[str, Any]] = []

    # Pre-compute normal profit so profit_change_pct is correct for every scenario,
    # including the normal scenario itself (previously normal_profit was None on that
    # iteration because assignment and use happened in the same loop pass).
    normal_metrics = calculate_profit(
        area_ha=area,
        yield_t_per_ha=round(base_yield * 1.0, 2),
        market_price_bdt_per_kg=price,
        total_cost_bdt=cost,
        crop_code=crop_code,
    )
    normal_profit: float = float(normal_metrics["net_profit_bdt"])

    for scenario in SCENARIO_DEFINITIONS:
        scenario_yield = round(base_yield * scenario["yield_multiplier"], 2)
        metrics = calculate_profit(
            area_ha=area,
            yield_t_per_ha=scenario_yield,
            market_price_bdt_per_kg=price,
            total_cost_bdt=cost,
            crop_code=crop_code,
        )

        if normal_profit != 0:
            profit_change_pct = round(
                ((float(metrics["net_profit_bdt"]) - normal_profit) / abs(normal_profit)) * 100.0,
                2,
            )
        else:
            profit_change_pct = 0.0

        scenarios_output.append(
            {
                "scenario_code": scenario["scenario_code"],
                "yield_t_per_ha": metrics["yield_t_per_ha"],
                "total_production_kg": metrics["total_production_kg"],
                "revenue_bdt": metrics["revenue_bdt"],
                "total_cost_bdt": metrics["total_cost_bdt"],
                "net_profit_bdt": metrics["net_profit_bdt"],
                "profit_change_pct_vs_normal": profit_change_pct,
            }
        )

    return scenarios_output


def build_prediction_response(
    payload: Dict[str, Any],
    prediction_id: int = 1,
) -> Dict[str, Any]:
    """
    Build the full shared JSON response contract from the input request payload.
    B can call this directly inside POST /api/predictions/ after saving to DB.
    """
    crop_code = validate_crop_code(payload.get("crop_code", "boro_rice"))
    area_ha = _validate_non_negative(payload["area_ha"], "area_ha")
    market_price = _validate_non_negative(
        payload["market_price_bdt_per_kg"], "market_price_bdt_per_kg"
    )
    total_cost = _validate_non_negative(payload["total_cost_bdt"], "total_cost_bdt")

    scenarios = calculate_scenarios(
        area_ha=area_ha,
        market_price_bdt_per_kg=market_price,
        total_cost_bdt=total_cost,
        crop_code=crop_code,
    )

    # Strip extra helper field if strict contract fields only are desired, or keep standard fields
    contract_scenarios = [
        {
            "scenario_code": s["scenario_code"],
            "yield_t_per_ha": s["yield_t_per_ha"],
            "total_production_kg": s["total_production_kg"],
            "revenue_bdt": s["revenue_bdt"],
            "total_cost_bdt": s["total_cost_bdt"],
            "net_profit_bdt": s["net_profit_bdt"],
        }
        for s in scenarios
    ]

    return {
        "success": True,
        "prediction_id": prediction_id,
        "farmer_name": payload.get("farmer_name", ""),
        "crop_code": crop_code,
        "farm": {
            "area_ha": round(area_ha, 2),
            "district": payload.get("district", ""),
            "upazila": payload.get("upazila", ""),
        },
        "currency": "BDT",
        "scenarios": contract_scenarios,
        "is_prototype_estimate": True,
    }



# Advisory Day-Count Helper


def get_advice(
    rows: List[Dict[str, Any]],
    transplant_date: date,
    today: date,
) -> Dict[str, Any]:
    """
    Filter reviewed crop guideline rows into 'do_now' (active today) and
    'coming_up' (starting within the next 7 days) based on days after transplanting.
    Only rows with is_verified=True (default True if omitted) are included.
    """
    if not isinstance(transplant_date, date) or not isinstance(today, date):
        raise TypeError("transplant_date and today must be datetime.date instances.")

    dat = (today - transplant_date).days
    verified_rows = [r for r in rows if r.get("is_verified", True)]

    now = [r for r in verified_rows if r["start_day"] <= dat <= r["end_day"]]
    soon = [r for r in verified_rows if dat < r["start_day"] <= dat + 7]

    result: Dict[str, Any] = {
        "days_after_transplant": dat,
        "do_now": now,
        "coming_up": soon,
    }
    if not now and not soon:
        result["message"] = "No reviewed task is available for today."
    return result