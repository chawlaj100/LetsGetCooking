import React from "react";
import { CheckCircle, AlertTriangle, Lightbulb, DollarSign } from "lucide-react";
import { BudgetInfo } from "../types";

interface BudgetCheckProps {
  budget: BudgetInfo;
  limit: number;
}

export const BudgetCheck: React.FC<BudgetCheckProps> = ({ budget, limit }) => {
  const isOver = budget.status === "OVER_BUDGET";
  const percentage = Math.min(Math.round((budget.estimatedCost / limit) * 100), 100);

  return (
    <div
      id="budget-check-container"
      className="bg-white rounded-[2rem] border border-linen-200 shadow-xs p-6"
    >
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isOver ? "bg-terracotta-50" : "bg-sage-50"}`}>
            <DollarSign className={`w-5 h-5 ${isOver ? "text-terracotta-500" : "text-sage-600"}`} />
          </div>
          <div>
            <h3 className="font-serif font-bold text-neutral-800 text-lg">
              Budget Feasibility Check
            </h3>
            <p className="text-xs font-semibold text-neutral-400 mt-0.5">
              Target Limit: ${limit.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="shrink-0">
          {isOver ? (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-terracotta-50 text-terracotta-800 border border-terracotta-100">
              <AlertTriangle className="w-3.5 h-3.5 stroke-[2.5]" />
              Over Budget
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-sage-50 text-sage-900 border border-sage-100">
              <CheckCircle className="w-3.5 h-3.5 stroke-[2.5]" />
              Under Budget
            </span>
          )}
        </div>
      </div>

      {/* Numerical and Visual Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
        <div className="md:col-span-1 bg-linen-100 rounded-xl p-4 flex flex-col justify-center">
          <span className="text-xs font-black uppercase tracking-[0.1em] text-neutral-400">
            Estimated Cost
          </span>
          <span className={`text-3xl font-serif font-bold mt-1 ${isOver ? "text-terracotta-500" : "text-sage-600"}`}>
            ${budget.estimatedCost.toFixed(2)}
          </span>
          <span className="text-2xs font-semibold text-neutral-400 mt-1">
            based on standard averages
          </span>
        </div>

        <div className="md:col-span-2 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
            <span>Budget Utilization</span>
            <span>{percentage}%</span>
          </div>
          <div className="w-full bg-linen-100 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isOver ? "bg-terracotta-500" : "bg-sage-600"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-2xs font-semibold text-neutral-400">
            <span>$0.00</span>
            <span>Target: ${limit.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Justification Explanation */}
      <div className="p-4 bg-linen-50/50 rounded-2xl border border-linen-100 mb-4">
        <p className="text-xs font-medium text-neutral-600 leading-relaxed">
          {budget.justification}
        </p>
      </div>

      {/* Cheap Suggestions */}
      {budget.cheapSuggestion && (
        <div className={`p-4 rounded-2xl border flex items-start gap-3.5 ${
          isOver 
            ? "bg-terracotta-50/30 border-terracotta-100 text-terracotta-800" 
            : "bg-sage-50/30 border-sage-100 text-sage-900"
        }`}>
          <div className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
            isOver ? "bg-terracotta-100/50 text-terracotta-500" : "bg-sage-100/50 text-sage-600"
          }`}>
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-black uppercase tracking-[0.1em] block mb-1">
              {isOver ? "Required Ingredient Swaps" : "Cost Saving Strategy"}
            </span>
            <p className="text-xs font-semibold leading-relaxed text-neutral-700">
              {budget.cheapSuggestion}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
