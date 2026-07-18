export interface Meal {
  name: string;
  prepTime: number; // in minutes
  steps: string[];
}

export interface GroceryItem {
  name: string;
  quantity: string;
  category: string;
}

export interface Substitution {
  original: string;
  substitute: string;
  reason: string;
}

export interface BudgetInfo {
  estimatedCost: number;
  status: 'UNDER_BUDGET' | 'OVER_BUDGET';
  justification: string;
  cheapSuggestion?: string;
}

export interface MealPlanResponse {
  meals: {
    breakfast: Meal;
    lunch: Meal;
    dinner: Meal;
  };
  groceryList: GroceryItem[];
  substitutions: Substitution[];
  budget: BudgetInfo;
}

export interface MealPlanRequest {
  prompt: string;
  budgetLimit: number;
  excludedIngredients?: string[];
  allergens?: string[];
}
