from __future__ import annotations

import argparse
import json
from collections import Counter
from dataclasses import dataclass


@dataclass(frozen=True)
class Meal:
    name: str
    ingredients: tuple[str, ...]
    substitutions: dict[str, str]
    estimated_cost: float


MEAL_TEMPLATES: dict[str, dict[str, Meal]] = {
    "quick": {
        "breakfast": Meal(
            name="Overnight oats with banana",
            ingredients=("oats", "milk", "banana", "honey"),
            substitutions={"milk": "oat milk", "banana": "apple"},
            estimated_cost=3.0,
        ),
        "lunch": Meal(
            name="Turkey wrap",
            ingredients=("tortilla", "turkey", "lettuce", "tomato"),
            substitutions={"turkey": "chickpeas", "tortilla": "whole-grain bread"},
            estimated_cost=5.5,
        ),
        "dinner": Meal(
            name="15-minute veggie stir-fry",
            ingredients=("rice", "mixed vegetables", "soy sauce", "tofu"),
            substitutions={"tofu": "chicken", "rice": "quinoa"},
            estimated_cost=7.0,
        ),
    },
    "high_protein": {
        "breakfast": Meal(
            name="Greek yogurt bowl",
            ingredients=("greek yogurt", "berries", "nuts", "honey"),
            substitutions={"greek yogurt": "soy yogurt", "nuts": "seeds"},
            estimated_cost=4.5,
        ),
        "lunch": Meal(
            name="Chicken quinoa bowl",
            ingredients=("chicken", "quinoa", "spinach", "olive oil"),
            substitutions={"chicken": "tofu", "quinoa": "brown rice"},
            estimated_cost=7.5,
        ),
        "dinner": Meal(
            name="Salmon and sweet potato",
            ingredients=("salmon", "sweet potato", "broccoli", "lemon"),
            substitutions={"salmon": "lentils", "broccoli": "green beans"},
            estimated_cost=9.5,
        ),
    },
    "vegetarian": {
        "breakfast": Meal(
            name="Avocado toast",
            ingredients=("bread", "avocado", "egg", "chili flakes"),
            substitutions={"egg": "tofu scramble", "bread": "gluten-free bread"},
            estimated_cost=4.0,
        ),
        "lunch": Meal(
            name="Chickpea salad",
            ingredients=("chickpeas", "cucumber", "tomato", "olive oil"),
            substitutions={"chickpeas": "black beans", "cucumber": "zucchini"},
            estimated_cost=5.5,
        ),
        "dinner": Meal(
            name="Lentil pasta",
            ingredients=("lentil pasta", "tomato sauce", "spinach", "parmesan"),
            substitutions={"parmesan": "nutritional yeast", "lentil pasta": "whole-wheat pasta"},
            estimated_cost=7.0,
        ),
    },
    "balanced": {
        "breakfast": Meal(
            name="Scrambled eggs and toast",
            ingredients=("eggs", "bread", "spinach", "butter"),
            substitutions={"eggs": "tofu scramble", "butter": "olive oil"},
            estimated_cost=3.5,
        ),
        "lunch": Meal(
            name="Rice and bean bowl",
            ingredients=("rice", "black beans", "corn", "avocado"),
            substitutions={"black beans": "kidney beans", "rice": "quinoa"},
            estimated_cost=5.0,
        ),
        "dinner": Meal(
            name="Baked chicken with vegetables",
            ingredients=("chicken", "potato", "carrot", "onion"),
            substitutions={"chicken": "tofu", "potato": "sweet potato"},
            estimated_cost=8.0,
        ),
    },
}

BUDGET_TOLERANCE = 0.01


def _choose_template(day_summary: str) -> str:
    text = day_summary.lower()
    if any(token in text for token in ("busy", "meeting", "late", "commute")):
        return "quick"
    if any(token in text for token in ("workout", "gym", "training", "run")):
        return "high_protein"
    if any(token in text for token in ("vegetarian", "vegan", "veg")):
        return "vegetarian"
    return "balanced"


def generate_plan(day_summary: str, budget: float, servings: int = 1) -> dict:
    if servings < 1:
        raise ValueError("servings must be at least 1")
    if budget < 0:
        raise ValueError("budget must be non-negative")

    template_name = _choose_template(day_summary)
    meals = MEAL_TEMPLATES[template_name]

    grocery_counter: Counter[str] = Counter()
    substitutions: dict[str, list[dict[str, str]]] = {}
    total_cost = 0.0

    for meal_type, meal in meals.items():
        grocery_counter.update(meal.ingredients)
        total_cost += meal.estimated_cost * servings
        substitutions[meal_type] = [
            {"ingredient": ingredient, "replacement": replacement}
            for ingredient, replacement in meal.substitutions.items()
        ]

    grocery_list = [f"{ingredient} x{count * servings}" for ingredient, count in sorted(grocery_counter.items())]

    feasible = total_cost <= budget
    if feasible and abs(total_cost - budget) < BUDGET_TOLERANCE:
        budget_message = "Exactly on budget."
    elif feasible:
        budget_message = f"Within budget by ${budget - total_cost:.2f}."
    else:
        budget_message = (
            f"Over budget by ${total_cost - budget:.2f}. "
            "Use listed substitutions and pantry staples first."
        )

    return {
        "day_summary": day_summary,
        "plan_type": template_name,
        "meals": {
            "breakfast": meals["breakfast"].name,
            "lunch": meals["lunch"].name,
            "dinner": meals["dinner"].name,
        },
        "todo_list": [
            "Review meal plan and confirm what is already in pantry.",
            "Buy items from grocery list.",
            "Prep ingredients for lunch and dinner in one batch.",
            "Cook meals in order: breakfast, lunch, dinner.",
        ],
        "grocery_list": grocery_list,
        "substitutions": substitutions,
        "budget": {
            "estimated_total": round(total_cost, 2),
            "limit": round(budget, 2),
            "feasible": feasible,
            "message": budget_message,
        },
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate a personal cooking to-do plan for the day.")
    parser.add_argument("--day", required=True, help="A short summary of your day (e.g. busy workday, gym day)")
    parser.add_argument("--budget", type=float, required=True, help="Your meal budget for the day")
    parser.add_argument("--servings", type=int, default=1, help="Number of servings per meal")
    args = parser.parse_args()

    plan = generate_plan(day_summary=args.day, budget=args.budget, servings=args.servings)
    print(json.dumps(plan, indent=2))


if __name__ == "__main__":
    main()
