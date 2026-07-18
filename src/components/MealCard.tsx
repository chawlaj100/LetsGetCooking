import React, { useState } from "react";
import { Coffee, Sun, Utensils, CheckCircle2, Circle, Clock } from "lucide-react";
import { Meal } from "../types";

interface MealCardProps {
  type: "breakfast" | "lunch" | "dinner";
  meal: Meal;
}

export const MealCard: React.FC<MealCardProps> = ({ type, meal }) => {
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const getMealHeader = () => {
    switch (type) {
      case "breakfast":
        return {
          title: "Breakfast",
          icon: <Coffee className="w-5 h-5 text-terracotta-500" id={`icon-breakfast`} />,
          bg: "bg-terracotta-50/50",
          border: "border-terracotta-100",
          badge: "text-terracotta-800 bg-terracotta-100/80",
        };
      case "lunch":
        return {
          title: "Lunch",
          icon: <Sun className="w-5 h-5 text-sage-600" id={`icon-lunch`} />,
          bg: "bg-sage-50/50",
          border: "border-sage-100",
          badge: "text-sage-900 bg-sage-100/80",
        };
      case "dinner":
        return {
          title: "Dinner",
          icon: <Utensils className="w-5 h-5 text-white" id={`icon-dinner`} />,
          bg: "bg-sage-50/90",
          border: "border-sage-600/30 ring-2 ring-sage-600/5",
          badge: "text-white bg-sage-600",
        };
    }
  };

  const header = getMealHeader();
  const totalSteps = meal.steps.length;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const isAllDone = totalSteps > 0 && completedCount === totalSteps;

  return (
    <div
      id={`meal-card-${type}`}
      className="bg-white rounded-[2rem] border border-linen-200 shadow-xs hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col h-full"
    >
      {/* Header */}
      <div className={`p-5 ${header.bg} border-b ${header.border} flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-xl shadow-2xs">
            {header.icon}
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-md ${header.badge}`}>
              {header.title}
            </span>
            <h3 className="font-serif font-bold text-neutral-800 text-lg mt-0.5 leading-tight">
              {meal.name}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-500 text-sm font-medium shrink-0">
          <Clock className="w-4 h-4 text-neutral-400" />
          <span>{meal.prepTime}m</span>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-terracotta-500 mb-4">
            Cooking To-Do List ({completedCount}/{totalSteps})
          </h4>
          <div className="space-y-3" role="list">
            {meal.steps.map((step, index) => {
              const isCompleted = !!completedSteps[index];
              return (
                <button
                  key={index}
                  onClick={() => toggleStep(index)}
                  className={`w-full text-left flex items-start gap-3 p-3 rounded-2xl transition-all duration-150 border group hover:bg-linen-50/30 ${
                    isCompleted
                      ? "bg-sage-50/40 border-sage-100/60 text-neutral-400"
                      : "bg-white border-linen-200 text-neutral-700"
                  }`}
                  role="listitem"
                  aria-pressed={isCompleted}
                >
                  <div className="mt-0.5 shrink-0 transition-transform duration-150 group-hover:scale-110">
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-sage-600 fill-sage-50" />
                    ) : (
                      <Circle className="w-5 h-5 text-neutral-300" />
                    )}
                  </div>
                  <div className="flex-1 text-xs font-semibold leading-relaxed">
                    <span className={isCompleted ? "line-through decoration-neutral-300" : ""}>
                      {step}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Completion Progress Bar */}
        {totalSteps > 0 && (
          <div className="mt-6 pt-4 border-t border-linen-200">
            <div className="flex items-center justify-between text-xs font-semibold text-neutral-400 mb-2">
              <span>Progress</span>
              <span>{Math.round((completedCount / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-linen-100 rounded-full h-1.5 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isAllDone ? "bg-sage-600" : "bg-terracotta-500"
                }`}
                style={{ width: `${(completedCount / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
