# LetsGetCooking

A simple AI-style micro-app that generates a personal cooking to-do list based on your day.

## Features

The app returns a structured plan with:
1. Breakfast/Lunch/Dinner meal suggestions
2. Grocery list
3. Ingredient substitutions
4. Budget feasibility logic

## Run

```bash
python meal_planner.py --day "busy workday with meetings" --budget 25 --servings 1
```

## Test

```bash
python -m unittest discover -s tests
```
