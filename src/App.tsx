import React, { useState, useEffect, useRef } from "react";
import { 
  UtensilsCrossed, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  HelpCircle, 
  Plus, 
  X, 
  DollarSign,
  Undo2,
  Calendar,
  Layers,
  Heart,
  BookOpen
} from "lucide-react";
import { MealPlanResponse, Substitution, GroceryItem } from "./types";
import { MealCard } from "./components/MealCard";
import { GroceryList } from "./components/GroceryList";
import { BudgetCheck } from "./components/BudgetCheck";
import { SubstitutionsList } from "./components/SubstitutionsList";

const PRESETS = [
  {
    title: "Busy Workday",
    prompt: "Back-to-back client meetings until 6 PM. Need an ultra-fast, healthy dinner. Out of chicken and avocados.",
    budget: 18,
    exclusions: ["chicken", "avocados"],
    allergens: []
  },
  {
    title: "Low Budget High Protein",
    prompt: "Trying to keep food high-protein and simple. Busy morning but relaxed afternoon to cook. Target $12.",
    budget: 12,
    exclusions: [],
    allergens: []
  },
  {
    title: "Gluten & Dairy Free Sunday",
    prompt: "A relaxed weekend day. Want comforting meals but need to keep it gluten and dairy free. Out of eggs.",
    budget: 25,
    exclusions: ["eggs"],
    allergens: ["Gluten-Free", "Dairy-Free"]
  }
];

const ALLERGENS_LIST = [
  "Gluten-Free",
  "Dairy-Free",
  "Peanut-Free",
  "Tree Nut-Free",
  "Soy-Free",
  "Shellfish-Free",
  "Egg-Free"
];

const LOADING_MESSAGES = [
  "Consulting local culinary database...",
  "Analyzing your schedule & meeting constraints...",
  "Curating high-nutrition, low-prep breakfast...",
  "Sourcing ingredients based on average market prices...",
  "Deduplicating and categorizing grocery items...",
  "Applying smart culinary substitutions...",
  "Double checking your $ budget limits...",
  "Garnishing and preparing your active dashboard..."
];

export default function App() {
  // Input Form States
  const [prompt, setPrompt] = useState("");
  const [budgetLimit, setBudgetLimit] = useState<number>(20);
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [selectedAllergens, setSelectedAllergens] = useState<string[]>([]);
  const [newExclusion, setNewExclusion] = useState("");

  // System & API States
  const [mealPlan, setMealPlan] = useState<MealPlanResponse | null>(null);
  const [viewMode, setViewMode] = useState<"form" | "plan">("form");
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  // Active cooking Tab for mobile responsiveness
  const [activeTab, setActiveTab] = useState<"meals" | "groceries" | "budget">("meals");

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem("latest_meal_plan");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setMealPlan(parsed);
        setViewMode("plan");
      } catch (e) {
        console.error("Failed to parse saved meal plan", e);
      }
    }
  }, []);

  // Loading animation interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      let stageIndex = 0;
      interval = setInterval(() => {
        stageIndex = (stageIndex + 1) % LOADING_MESSAGES.length;
        setLoadingStage(LOADING_MESSAGES[stageIndex]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleAddExclusion = (e: React.FormEvent) => {
    e.preventDefault();
    if (newExclusion.trim()) {
      const formatted = newExclusion.trim().toLowerCase();
      if (!excludedIngredients.includes(formatted)) {
        setExcludedIngredients((prev) => [...prev, formatted]);
      }
      setNewExclusion("");
    }
  };

  const handleRemoveExclusion = (ing: string) => {
    setExcludedIngredients((prev) => prev.filter((i) => i !== ing));
  };

  const handleToggleAllergen = (all: string) => {
    setSelectedAllergens((prev) =>
      prev.includes(all) ? prev.filter((a) => a !== all) : [...prev, all]
    );
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setPrompt(preset.prompt);
    setBudgetLimit(preset.budget);
    setExcludedIngredients(preset.exclusions);
    setSelectedAllergens(preset.allergens);
  };

  const generateMealPlan = async () => {
    if (!prompt.trim()) {
      setError("Please write something about your daily schedule or schedule details.");
      return;
    }

    setLoading(true);
    setError(null);
    setMealPlan(null);

    try {
      const res = await fetch("/api/mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          budgetLimit,
          excludedIngredients,
          allergens: selectedAllergens,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP error! status: ${res.status}`);
      }

      const data: MealPlanResponse = await res.json();
      setMealPlan(data);
      localStorage.setItem("latest_meal_plan", JSON.stringify(data));
      setViewMode("plan");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "An unexpected error occurred. Please verify your internet connection or API keys.");
    } finally {
      setLoading(false);
    }
  };

  const clearPlan = () => {
    setMealPlan(null);
    localStorage.removeItem("latest_meal_plan");
    setViewMode("form");
  };

  return (
    <div className="min-h-screen bg-linen-50 text-neutral-800 font-sans selection:bg-sage-100 selection:text-sage-900">
      {/* Upper Navigation / Decorative Banner */}
      <header className="bg-white border-b border-linen-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sage-600 flex items-center justify-center text-white shadow-sm">
              <UtensilsCrossed className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="font-serif font-bold italic text-2xl tracking-tight text-sage-600">
                AI Meal Planner
              </h1>
              <p className="text-2xs font-bold text-terracotta-500 uppercase tracking-widest mt-0.5">
                Bento AI &amp; Budget Optimizer
              </p>
            </div>
          </div>
          {mealPlan && (
            <div className="flex items-center gap-2">
              {viewMode === "plan" ? (
                <button
                  onClick={() => setViewMode("form")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-linen-200 hover:bg-linen-100 rounded-xl text-xs font-bold text-neutral-600 transition-colors bg-white shadow-2xs cursor-pointer"
                >
                  Modify Inputs
                </button>
              ) : (
                <button
                  onClick={() => setViewMode("plan")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-sage-600 hover:bg-sage-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer animate-fade-in-up"
                >
                  View Active Plan
                </button>
              )}
              <button
                onClick={clearPlan}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 border border-terracotta-100 hover:bg-terracotta-50 text-terracotta-800 rounded-xl text-xs font-bold transition-colors bg-white shadow-2xs cursor-pointer"
              >
                <Undo2 className="w-3.5 h-3.5 text-terracotta-500" />
                Reset Plan
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Callout */}
        {error && (
          <div className="mb-6 p-4 bg-terracotta-50 border border-terracotta-100 rounded-2xl flex items-start gap-3.5 animate-fade-in-up">
            <AlertCircle className="w-5 h-5 text-terracotta-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-bold text-terracotta-800 text-sm">Meal Planning Error</h4>
              <p className="text-xs font-medium text-terracotta-800/80 mt-1 leading-relaxed">{error}</p>
            </div>
            <button 
              onClick={() => setError(null)}
              className="p-1 rounded-lg hover:bg-terracotta-100/50 text-terracotta-500 hover:text-terracotta-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {viewMode === "form" && !loading ? (
          /* Step 1: Input Page / Clean Workstation */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
            {/* Presets & Tips Sidebar */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white rounded-[2rem] border border-linen-200 shadow-xs p-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-terracotta-500 flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-terracotta-500" />
                  Try a Fast Preset
                </h3>
                <div className="space-y-3">
                  {PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => applyPreset(preset)}
                      className="w-full text-left p-4 rounded-2xl border border-linen-200 hover:border-sage-600 hover:bg-sage-50/10 transition-all group cursor-pointer"
                    >
                      <span className="font-bold text-xs text-neutral-800 group-hover:text-sage-600 block transition-colors">
                        {preset.title}
                      </span>
                      <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed line-clamp-2">
                        "{preset.prompt}"
                      </p>
                      <div className="flex gap-2 mt-3 flex-wrap">
                        <span className="text-2xs bg-sage-50 border border-sage-100 px-2 py-0.5 rounded-md font-semibold text-sage-900">
                          Budget: ${preset.budget}
                        </span>
                        {preset.exclusions.map((exc) => (
                          <span key={exc} className="text-2xs bg-terracotta-50 border border-terracotta-100 px-2 py-0.5 rounded-md font-semibold text-terracotta-800">
                            No {exc}
                          </span>
                        ))}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cooking / Nutritional Tips */}
              <div className="bg-linen-100 border border-linen-200 rounded-[2rem] p-6 relative overflow-hidden">
                <div className="absolute right-0 bottom-0 translate-x-4 translate-y-4 opacity-5 text-sage-600">
                  <UtensilsCrossed className="w-40 h-40" />
                </div>
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-sage-900 flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-sage-600 text-sage-600" />
                  Nutritional Design
                </h4>
                <p className="text-xs font-medium text-neutral-600 mt-3 leading-relaxed">
                  Our model builds nutritionally whole breakfast, lunch, and dinner structures based on the time constraints of your schedule.
                </p>
                <div className="mt-5 space-y-3.5 border-t border-linen-200 pt-4">
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-white border border-linen-200 flex items-center justify-center text-sage-600 font-bold text-2xs shadow-2xs">1</div>
                    <p className="text-2xs text-neutral-500 leading-relaxed">
                      <strong>Chronological steps:</strong> Each recipe features a direct to-do list perfect for active kitchen prep.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-5 h-5 rounded-full bg-white border border-linen-200 flex items-center justify-center text-sage-600 font-bold text-2xs shadow-2xs">2</div>
                    <p className="text-2xs text-neutral-500 leading-relaxed">
                      <strong>Budget checks:</strong> Ingredients are costed based on average market baskets, generating proactive cheap substitutions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Interactive Form */}
            <div className="lg:col-span-7 bg-white rounded-[2.5rem] border border-linen-200 shadow-xs p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="font-serif font-bold italic text-sage-600 text-2xl tracking-tight">
                  Design Your Day
                </h2>
                <p className="text-xs font-semibold text-neutral-400 mt-1">
                  Describe your schedule, food preferences, or active missing items below.
                </p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <label htmlFor="daily-prompt" className="text-xs font-black uppercase tracking-[0.2em] text-sage-900 block">
                  Daily Context / Schedule Details
                </label>
                <textarea
                  id="daily-prompt"
                  rows={4}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. 'I have a high-stress afternoon with continuous meetings, need something rapid for lunch that doesn't feel heavy, and I have salmon in the fridge.'"
                  className="w-full rounded-2xl border border-linen-200 px-4 py-3.5 text-sm font-medium placeholder-neutral-400 text-neutral-800 focus:outline-none focus:ring-2 focus:ring-sage-600/20 focus:border-sage-600 transition-all resize-none bg-linen-50/20"
                />
              </div>

              {/* Slider / Budget Limit */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="budget-limit" className="text-xs font-black uppercase tracking-[0.2em] text-sage-900 block">
                    Daily Budget Limit ($)
                  </label>
                  <span className="text-sm font-bold text-sage-900 bg-sage-50 border border-sage-100 px-3 py-1 rounded-lg">
                    ${budgetLimit} USD
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-neutral-400">$5</span>
                  <input
                    id="budget-limit"
                    type="range"
                    min={5}
                    max={100}
                    step={1}
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(Number(e.target.value))}
                    className="w-full accent-sage-600 cursor-pointer h-2 bg-linen-100 rounded-lg appearance-none"
                  />
                  <span className="text-xs font-bold text-neutral-400">$100</span>
                </div>
              </div>

              {/* Excluded Ingredients Field */}
              <div className="space-y-2">
                <label htmlFor="exclusion-input" className="text-xs font-black uppercase tracking-[0.2em] text-sage-900 block">
                  Pantry Deficits / Excluded Ingredients
                </label>
                <form onSubmit={handleAddExclusion} className="flex gap-2">
                  <input
                    id="exclusion-input"
                    type="text"
                    value={newExclusion}
                    onChange={(e) => setNewExclusion(e.target.value)}
                    placeholder="e.g. eggs, tomatoes, dairy"
                    className="flex-1 rounded-xl border border-linen-200 px-4 py-2.5 text-sm font-medium text-neutral-800 focus:outline-none focus:ring-2 focus:ring-sage-600/20 focus:border-sage-600 transition-all bg-linen-50/10"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-linen-100 hover:bg-linen-200 text-sage-900 rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </form>

                {/* Exclusions Tags */}
                {excludedIngredients.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2" id="exclusions-list">
                    {excludedIngredients.map((ing) => (
                      <span
                        key={ing}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-terracotta-50 border border-terracotta-100 rounded-lg text-xs font-bold text-terracotta-800 animate-fade-in-up"
                      >
                        {ing}
                        <button
                          type="button"
                          onClick={() => handleRemoveExclusion(ing)}
                          className="hover:text-terracotta-500 p-0.5 rounded-full hover:bg-terracotta-100/50 transition-all cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Allergens Checklist */}
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-sage-900 block">
                  Allergen Filters
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {ALLERGENS_LIST.map((all) => {
                    const isSelected = selectedAllergens.includes(all);
                    return (
                      <button
                        key={all}
                        type="button"
                        onClick={() => handleToggleAllergen(all)}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all text-left flex items-center justify-between ${
                          isSelected
                            ? "bg-sage-50 border-sage-600 text-sage-900 ring-2 ring-sage-600/5 shadow-2xs"
                            : "bg-white border-linen-200 hover:bg-linen-50 text-neutral-600"
                        }`}
                      >
                        <span>{all}</span>
                        {isSelected && (
                          <span className="w-2 h-2 bg-sage-600 rounded-full" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-4 border-t border-linen-200 flex items-center justify-end">
                <button
                  type="button"
                  onClick={generateMealPlan}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-sage-600 hover:bg-sage-700 text-white rounded-2xl text-sm font-bold shadow-lg shadow-sage-600/20 transition-all hover:scale-[1.01] cursor-pointer"
                >
                  Generate AI Meal Plan
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : loading ? (
          /* Step 2: Skeleton Loading Stage */
          <div className="max-w-2xl mx-auto py-16 text-center space-y-8 animate-pulse" id="loading-skeleton">
            <div className="w-16 h-16 bg-sage-50 rounded-2xl flex items-center justify-center text-sage-600 mx-auto animate-bounce">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-3">
              <h3 className="font-serif font-bold italic text-2xl text-neutral-800">
                Crafting Your Optimized Culinary Plan
              </h3>
              <p className="text-xs font-black text-terracotta-500 uppercase tracking-[0.2em] min-h-[20px]">
                {loadingStage}
              </p>
            </div>

            {/* Skeleton visual block */}
            <div className="space-y-3 bg-white border border-linen-200 p-6 rounded-[2rem] shadow-xs text-left">
              <div className="flex gap-4 items-center mb-4">
                <div className="w-10 h-10 bg-linen-100 rounded-lg animate-pulse" />
                <div className="space-y-2 flex-1 animate-pulse">
                  <div className="h-4 bg-linen-100 rounded w-1/3" />
                  <div className="h-3 bg-linen-100 rounded w-1/4" />
                </div>
              </div>
              <div className="h-3 bg-linen-100 rounded w-full animate-pulse" />
              <div className="h-3 bg-linen-100 rounded w-5/6 animate-pulse" />
              <div className="h-3 bg-linen-100 rounded w-4/5 animate-pulse" />
            </div>
          </div>
        ) : (
          /* Step 3: Output Page (The Dashboard) */
          <div className="space-y-8 animate-fade-in-up">
            {/* Header details card */}
            <div className="bg-white rounded-[2rem] border border-linen-200 p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-sage-50 text-sage-900 font-bold text-xs rounded-full border border-sage-100 mb-2">
                  <Calendar className="w-3.5 h-3.5" />
                  Your Active Culinary Plan
                </span>
                <h2 className="font-serif font-bold italic text-sage-600 text-2xl md:text-3xl tracking-tight">
                  Daily Cooking &amp; Grocery Breakdown
                </h2>
                <p className="text-xs font-semibold text-neutral-400 mt-1 leading-relaxed">
                  Generated based on: "{prompt}"
                </p>
              </div>

              {/* Brief tags */}
              <div className="flex gap-2.5 flex-wrap">
                <div className="px-3.5 py-2 bg-linen-100 rounded-xl border border-linen-200 flex flex-col justify-center">
                  <span className="text-2xs font-bold text-neutral-400 uppercase tracking-wider">
                    Limit target
                  </span>
                  <span className="text-sm font-extrabold text-neutral-700 mt-0.5">
                    ${budgetLimit}
                  </span>
                </div>
                {excludedIngredients.length > 0 && (
                  <div className="px-3.5 py-2 bg-linen-100 rounded-xl border border-linen-200 flex flex-col justify-center">
                    <span className="text-2xs font-bold text-neutral-400 uppercase tracking-wider">
                      Deficits
                    </span>
                    <span className="text-sm font-extrabold text-neutral-700 mt-0.5">
                      {excludedIngredients.length}
                    </span>
                  </div>
                )}
                {selectedAllergens.length > 0 && (
                  <div className="px-3.5 py-2 bg-linen-100 rounded-xl border border-linen-200 flex flex-col justify-center">
                    <span className="text-2xs font-bold text-neutral-400 uppercase tracking-wider">
                      Allergens
                    </span>
                    <span className="text-sm font-extrabold text-neutral-700 mt-0.5">
                      {selectedAllergens.length}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Layout tabs for mobile screen sizing */}
            <div className="flex md:hidden bg-linen-100 p-1.5 rounded-xl gap-1">
              <button
                onClick={() => setActiveTab("meals")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "meals" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                }`}
              >
                Meals
              </button>
              <button
                onClick={() => setActiveTab("groceries")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "groceries" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                }`}
              >
                Groceries
              </button>
              <button
                onClick={() => setActiveTab("budget")}
                className={`flex-1 text-center py-2 text-xs font-bold rounded-lg transition-all ${
                  activeTab === "budget" ? "bg-white text-neutral-900 shadow-2xs" : "text-neutral-500"
                }`}
              >
                Budget &amp; Tips
              </button>
            </div>

            {/* Main grid columns */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              {/* Left Column: Meal Cards (8 cols on desktop) */}
              <div className={`md:col-span-8 space-y-6 ${activeTab !== "meals" ? "hidden md:block" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-4 h-4 text-sage-600" />
                  <h3 className="font-serif font-bold italic text-xl text-neutral-800">
                    Step-by-Step Meal Instructions
                  </h3>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {mealPlan?.meals?.breakfast && (
                    <MealCard type="breakfast" meal={mealPlan.meals.breakfast} />
                  )}
                  {mealPlan?.meals?.lunch && (
                    <MealCard type="lunch" meal={mealPlan.meals.lunch} />
                  )}
                  {mealPlan?.meals?.dinner && (
                    <MealCard type="dinner" meal={mealPlan.meals.dinner} />
                  )}
                </div>

                {/* Substitutions below the meals */}
                <div className="mt-8">
                  <SubstitutionsList substitutions={mealPlan?.substitutions || []} />
                </div>
              </div>

              {/* Right Column: Grocery and Budget Check (4 cols on desktop) */}
              <div className={`md:col-span-4 space-y-6 ${activeTab === "meals" ? "hidden md:block" : ""}`}>
                {/* Budget card */}
                {(activeTab === "budget" || activeTab === "groceries" || activeTab === "meals") && mealPlan?.budget && (
                  <div className={activeTab === "groceries" ? "hidden md:block" : ""}>
                    <BudgetCheck budget={mealPlan.budget} limit={budgetLimit} />
                  </div>
                )}

                {/* Groceries card */}
                {(activeTab === "groceries" || activeTab === "meals" || activeTab === "budget") && mealPlan?.groceryList && (
                  <div className={activeTab === "budget" ? "hidden md:block" : ""}>
                    <GroceryList items={mealPlan.groceryList} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
