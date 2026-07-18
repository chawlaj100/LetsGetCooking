import unittest

from meal_planner import generate_plan


class GeneratePlanTests(unittest.TestCase):
    def test_generates_required_sections(self):
        plan = generate_plan(day_summary="busy office day", budget=30, servings=1)

        self.assertIn("breakfast", plan["meals"])
        self.assertIn("lunch", plan["meals"])
        self.assertIn("dinner", plan["meals"])
        self.assertTrue(plan["grocery_list"])
        self.assertTrue(plan["substitutions"])
        self.assertIn("feasible", plan["budget"])

    def test_budget_feasibility_logic(self):
        baseline = generate_plan(day_summary="normal day", budget=100, servings=1)
        small_margin = 0.01
        budget_limit = baseline["budget"]["estimated_total"] - small_margin
        plan = generate_plan(day_summary="normal day", budget=budget_limit, servings=1)

        self.assertGreater(plan["budget"]["estimated_total"], plan["budget"]["limit"])
        self.assertFalse(plan["budget"]["feasible"])
        self.assertIn("Over budget", plan["budget"]["message"])

    def test_selects_high_protein_template_for_workout_keywords(self):
        plan = generate_plan(day_summary="morning workout and run", budget=50, servings=1)

        self.assertEqual(plan["plan_type"], "high_protein")

    def test_budget_message_when_feasible(self):
        plan = generate_plan(day_summary="busy office day", budget=30, servings=1)

        self.assertTrue(plan["budget"]["feasible"])
        self.assertIn("Within budget", plan["budget"]["message"])

    def test_invalid_servings_raises(self):
        with self.assertRaises(ValueError):
            generate_plan(day_summary="normal day", budget=20, servings=0)

    def test_invalid_budget_raises(self):
        with self.assertRaises(ValueError):
            generate_plan(day_summary="normal day", budget=-1, servings=1)


if __name__ == "__main__":
    unittest.main()
