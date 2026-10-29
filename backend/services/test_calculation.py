"""
Unit tests for YieldMax V1 Calculation Engine (backend/tests/test_calculation.py)
Owner: Member A (Team Lead & Calculation Engine Developer)

Run with either:
    pytest test_calculation.py
or:
    python3 -m unittest test_calculation.py
"""

from datetime import date
import unittest

from services.calculations import (
    build_prediction_response,
    calculate_profit,
    calculate_scenarios,
    calculate_yield,
    get_advice,
)


class TestYieldMaxCalculations(unittest.TestCase):
    """Comprehensive unit tests for V1 agricultural calculation engine."""

    def setUp(self) -> None:
        """Set up agreed Rahim demo example inputs."""
        self.rahim_input = {
            "farmer_name": "Rahim",
            "area_ha": 2.0,
            "district": "Bogura",
            "upazila": "Shibganj",
            "land_type": "lowland",
            "crop_code": "boro_rice",
            "planting_date": "2026-12-15",
            "market_price_bdt_per_kg": 30,
            "total_cost_bdt": 150000,
        }

    # 1. Correct production calculation
    def test_calculate_yield_rahim_baseline(self) -> None:
        production_kg = calculate_yield(area_ha=2.0, yield_t_per_ha=5.0, crop_code="boro_rice")
        self.assertEqual(production_kg, 10000)

    # 2. Correct revenue calculation
    def test_calculate_profit_revenue_rahim(self) -> None:
        result = calculate_profit(
            area_ha=2.0,
            yield_t_per_ha=5.0,
            market_price_bdt_per_kg=30,
            total_cost_bdt=150000,
        )
        self.assertEqual(result["revenue_bdt"], 300000)

    # 3. Correct net profit calculation
    def test_calculate_profit_net_profit_rahim(self) -> None:
        result = calculate_profit(
            area_ha=2.0,
            yield_t_per_ha=5.0,
            market_price_bdt_per_kg=30,
            total_cost_bdt=150000,
        )
        self.assertEqual(result["total_production_kg"], 10000)
        self.assertEqual(result["total_cost_bdt"], 150000)
        self.assertEqual(result["net_profit_bdt"], 150000)

    # 4. All three scenarios return the expected Rahim values
    def test_calculate_scenarios_rahim_expected_values(self) -> None:
        scenarios = calculate_scenarios(
            area_ha=2.0,
            market_price_bdt_per_kg=30,
            total_cost_bdt=150000,
            crop_code="boro_rice",
        )
        self.assertEqual(len(scenarios), 3)

        by_code = {s["scenario_code"]: s for s in scenarios}

        # Normal scenario: 5.0 t/ha -> 10,000 kg -> 300,000 BDT revenue -> 150,000 BDT net profit
        self.assertEqual(by_code["normal"]["yield_t_per_ha"], 5.0)
        self.assertEqual(by_code["normal"]["total_production_kg"], 10000)
        self.assertEqual(by_code["normal"]["revenue_bdt"], 300000)
        self.assertEqual(by_code["normal"]["total_cost_bdt"], 150000)
        self.assertEqual(by_code["normal"]["net_profit_bdt"], 150000)
        self.assertEqual(by_code["normal"]["profit_change_pct_vs_normal"], 0.0)

        # Low-rain scenario: 4.0 t/ha -> 8,000 kg -> 240,000 BDT revenue -> 90,000 BDT net profit
        self.assertEqual(by_code["low_rain"]["yield_t_per_ha"], 4.0)
        self.assertEqual(by_code["low_rain"]["total_production_kg"], 8000)
        self.assertEqual(by_code["low_rain"]["revenue_bdt"], 240000)
        self.assertEqual(by_code["low_rain"]["total_cost_bdt"], 150000)
        self.assertEqual(by_code["low_rain"]["net_profit_bdt"], 90000)
        self.assertEqual(by_code["low_rain"]["profit_change_pct_vs_normal"], -40.0)

        # Heavy-rain scenario: 4.5 t/ha -> 9,000 kg -> 270,000 BDT revenue -> 120,000 BDT net profit
        self.assertEqual(by_code["heavy_rain"]["yield_t_per_ha"], 4.5)
        self.assertEqual(by_code["heavy_rain"]["total_production_kg"], 9000)
        self.assertEqual(by_code["heavy_rain"]["revenue_bdt"], 270000)
        self.assertEqual(by_code["heavy_rain"]["total_cost_bdt"], 150000)
        self.assertEqual(by_code["heavy_rain"]["net_profit_bdt"], 120000)
        self.assertEqual(by_code["heavy_rain"]["profit_change_pct_vs_normal"], -20.0)

    # 5. Zero-area input
    def test_zero_area_input(self) -> None:
        production = calculate_yield(area_ha=0, yield_t_per_ha=5.0)
        self.assertEqual(production, 0)

        profit_result = calculate_profit(
            area_ha=0,
            yield_t_per_ha=5.0,
            market_price_bdt_per_kg=30,
            total_cost_bdt=150000,
        )
        self.assertEqual(profit_result["total_production_kg"], 0)
        self.assertEqual(profit_result["revenue_bdt"], 0)
        self.assertEqual(profit_result["net_profit_bdt"], -150000)

    # 6. Zero market price
    def test_zero_market_price(self) -> None:
        profit_result = calculate_profit(
            area_ha=2.0,
            yield_t_per_ha=5.0,
            market_price_bdt_per_kg=0,
            total_cost_bdt=150000,
        )
        self.assertEqual(profit_result["total_production_kg"], 10000)
        self.assertEqual(profit_result["revenue_bdt"], 0)
        self.assertEqual(profit_result["net_profit_bdt"], -150000)

    # 7. Invalid negative area, price, yield, or cost
    def test_invalid_negative_inputs_raise_value_error(self) -> None:
        with self.assertRaises(ValueError):
            calculate_yield(area_ha=-1.0, yield_t_per_ha=5.0)

        with self.assertRaises(ValueError):
            calculate_yield(area_ha=2.0, yield_t_per_ha=-5.0)

        with self.assertRaises(ValueError):
            calculate_profit(
                area_ha=2.0,
                yield_t_per_ha=5.0,
                market_price_bdt_per_kg=-30,
                total_cost_bdt=150000,
            )

        with self.assertRaises(ValueError):
            calculate_profit(
                area_ha=2.0,
                yield_t_per_ha=5.0,
                market_price_bdt_per_kg=30,
                total_cost_bdt=-1000,
            )

    # 8. Invalid or unsupported crop code
    def test_invalid_or_unsupported_crop_code(self) -> None:
        for invalid_crop in ["wheat", "potato", "aman_rice", "", "   "]:
            with self.assertRaises(ValueError):
                calculate_yield(area_ha=2.0, yield_t_per_ha=5.0, crop_code=invalid_crop)

            with self.assertRaises(ValueError):
                calculate_scenarios(
                    area_ha=2.0,
                    market_price_bdt_per_kg=30,
                    total_cost_bdt=150000,
                    crop_code=invalid_crop,
                )

    # 9. Consistent numeric types and output field names in full contract
    def test_consistent_types_and_output_contract(self) -> None:
        response = build_prediction_response(self.rahim_input, prediction_id=1)

        expected_top_keys = {
            "success",
            "prediction_id",
            "farmer_name",
            "crop_code",
            "farm",
            "currency",
            "scenarios",
            "is_prototype_estimate",
        }
        self.assertEqual(set(response.keys()), expected_top_keys)
        self.assertTrue(response["success"])
        self.assertTrue(response["is_prototype_estimate"])
        self.assertEqual(response["currency"], "BDT")
        self.assertEqual(response["crop_code"], "boro_rice")
        self.assertIsInstance(response["farm"]["area_ha"], float)

        expected_scenario_keys = {
            "scenario_code",
            "yield_t_per_ha",
            "total_production_kg",
            "revenue_bdt",
            "total_cost_bdt",
            "net_profit_bdt",
        }
        for scenario in response["scenarios"]:
            self.assertEqual(set(scenario.keys()), expected_scenario_keys)
            self.assertIsInstance(scenario["yield_t_per_ha"], float)
            self.assertIsInstance(scenario["total_production_kg"], (int, float))
            self.assertIsInstance(scenario["revenue_bdt"], (int, float))
            self.assertIsInstance(scenario["total_cost_bdt"], (int, float))
            self.assertIsInstance(scenario["net_profit_bdt"], (int, float))

    # 10. Advisory day-count service check
    def test_advisory_get_advice_filtering(self) -> None:
        sample_rows = [
            {
                "id": "g-014",
                "stage": "Early tillering",
                "topic": "fertilizer",
                "start_day": 15,
                "end_day": 20,
                "instruction": "Apply the first third of the season's urea.",
                "is_verified": True,
            },
            {
                "id": "g-016",
                "stage": "Active tillering",
                "topic": "fertilizer",
                "start_day": 25,
                "end_day": 30,
                "instruction": "Apply the second third of urea.",
                "is_verified": True,
            },
            {
                "id": "g-999",
                "stage": "Unverified",
                "topic": "spray",
                "start_day": 15,
                "end_day": 20,
                "instruction": "Unverified row that must never appear.",
                "is_verified": False,
            },
        ]
        result = get_advice(
            rows=sample_rows,
            transplant_date=date(2027, 1, 5),
            today=date(2027, 1, 25),  # 20 days after transplanting
        )
        self.assertEqual(result["days_after_transplant"], 20)
        self.assertEqual(len(result["do_now"]), 1)
        self.assertEqual(result["do_now"][0]["id"], "g-014")
        self.assertEqual(len(result["coming_up"]), 1)
        self.assertEqual(result["coming_up"][0]["id"], "g-016")


if __name__ == "__main__":
    unittest.main()