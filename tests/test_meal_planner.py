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
        plan = generate_plan(day_summary="normal day", budget=2, servings=1)

        self.assertFalse(plan["budget"]["feasible"])
        self.assertIn("Over budget", plan["budget"]["message"])

    def test_template_selection_for_workout_day(self):
        plan = generate_plan(day_summary="morning workout and run", budget=50, servings=1)

        self.assertEqual(plan["plan_type"], "high_protein")


if __name__ == "__main__":
    unittest.main()
