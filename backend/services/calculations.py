
def estimate_yield(crop_code):
    """
    Return the prototype baseline yield in tonnes per hectare.
    This is a demo assumption, not a real-world forecast.
    """
    baseline_yields = {
        "boro_rice": 5.0,
    }

    if crop_code not in baseline_yields:
        raise ValueError(f"Unsupported crop code: {crop_code}")

    return baseline_yields[crop_code]


def apply_scenario(base_yield, scenario_code):
    """
    Apply illustrative rainfall scenario adjustments to baseline yield.
    """
    scenario_multipliers = {
        "normal": 1.0,
        "low_rain": 0.8,
        "heavy_rain": 0.9,
    }

    if scenario_code not in scenario_multipliers:
        raise ValueError(f"Unsupported scenario: {scenario_code}")

    return round(base_yield * scenario_multipliers[scenario_code], 3)


def calculate_profit(area_ha, yield_t_per_ha, price_per_kg, total_cost_bdt):
    """
    Calculate production, revenue, and net profit.
    """
    total_production_kg = round(area_ha * yield_t_per_ha * 1000, 2)
    revenue_bdt = round(total_production_kg * price_per_kg, 2)
    net_profit_bdt = round(revenue_bdt - total_cost_bdt, 2)

    return {
        "total_production_kg": total_production_kg,
        "revenue_bdt": revenue_bdt,
        "total_cost_bdt": round(total_cost_bdt, 2),
        "net_profit_bdt": net_profit_bdt,
    }
