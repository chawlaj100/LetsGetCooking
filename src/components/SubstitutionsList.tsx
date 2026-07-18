import React from "react";
import { ArrowRight, RefreshCw, ShieldCheck } from "lucide-react";
import { Substitution } from "../types";

interface SubstitutionsListProps {
  substitutions: Substitution[];
}

export const SubstitutionsList: React.FC<SubstitutionsListProps> = ({ substitutions }) => {
  if (substitutions.length === 0) {
    return (
      <div
        id="substitutions-empty"
        className="bg-white rounded-[2rem] border border-linen-200 shadow-xs p-6 flex flex-col items-center justify-center text-center py-10"
      >
        <div className="w-12 h-12 rounded-full bg-sage-50 flex items-center justify-center text-sage-600 mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h3 className="font-serif font-bold text-neutral-800 text-base">
          Perfect Ingredient Match
        </h3>
        <p className="text-xs font-semibold text-neutral-400 max-w-xs mt-1">
          No ingredient exclusions or allergen substitutions were required for this meal plan!
        </p>
      </div>
    );
  }

  return (
    <div
      id="substitutions-container"
      className="bg-white rounded-[2rem] border border-linen-200 shadow-xs p-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-sage-50 rounded-xl">
          <RefreshCw className="w-5 h-5 text-sage-600" />
        </div>
        <div>
          <h3 className="font-serif font-bold text-neutral-800 text-lg">
            Smart Ingredient Substitutions
          </h3>
          <p className="text-xs font-semibold text-neutral-400 mt-0.5">
            1:1 recipe swaps based on allergies and missing pantry items
          </p>
        </div>
      </div>

      <div className="space-y-3.5">
        {substitutions.map((sub, idx) => (
          <div
            key={idx}
            className="p-4 rounded-2xl border border-linen-200 hover:border-linen-200/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 bg-linen-50/10"
          >
            {/* Swapping visualization */}
            <div className="flex items-center gap-3.5 flex-wrap">
              <span className="text-xs font-bold text-neutral-500 bg-linen-100 px-3 py-1.5 rounded-lg line-through decoration-neutral-300">
                {sub.original}
              </span>
              <ArrowRight className="w-4 h-4 text-terracotta-500" />
              <span className="text-xs font-bold text-terracotta-800 bg-terracotta-50 border border-terracotta-100 px-3 py-1.5 rounded-lg">
                {sub.substitute}
              </span>
            </div>

            {/* Substitution reason explanation */}
            <div className="md:max-w-md text-xs font-semibold text-neutral-600">
              {sub.reason}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
