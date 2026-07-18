import React, { useState } from "react";
import { Check, ShoppingBag, Grid, CheckSquare, Square } from "lucide-react";
import { GroceryItem } from "../types";

interface GroceryListProps {
  items: GroceryItem[];
}

export const GroceryList: React.FC<GroceryListProps> = ({ items }) => {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Generate unique categories
  const categories = ["All", ...Array.from(new Set(items.map((item) => item.category)))];

  const toggleItem = (name: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const checkAll = () => {
    const next: Record<string, boolean> = {};
    filteredItems.forEach((item) => {
      next[item.name] = true;
    });
    setCheckedItems((prev) => ({ ...prev, ...next }));
  };

  const clearAll = () => {
    const next: Record<string, boolean> = { ...checkedItems };
    filteredItems.forEach((item) => {
      next[item.name] = false;
    });
    setCheckedItems(next);
  };

  const filteredItems = items.filter(
    (item) => selectedCategory === "All" || item.category === selectedCategory
  );

  // Group items by category
  const initialAcc: Record<string, GroceryItem[]> = {};
  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, initialAcc);

  const totalFilteredCount = filteredItems.length;
  const checkedFilteredCount = filteredItems.filter((item) => checkedItems[item.name]).length;

  return (
    <div
      id="grocery-list-container"
      className="bg-white rounded-[2rem] border border-linen-200 shadow-xs p-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-sage-50 rounded-xl">
            <ShoppingBag className="w-5 h-5 text-sage-600" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-neutral-800 text-lg">
              Grocery Shopping List
            </h3>
            <p className="text-xs font-semibold text-neutral-400 mt-0.5">
              {checkedFilteredCount} of {totalFilteredCount} items purchased
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={checkAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-sage-900 bg-linen-100 hover:bg-linen-200 transition-colors"
          >
            Mark All Got
          </button>
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-xl text-xs font-bold text-sage-900 bg-linen-100 hover:bg-linen-200 transition-colors"
          >
            Reset List
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 mb-6 pb-2 border-b border-linen-100" role="tablist">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? "bg-sage-600 text-white shadow-2xs"
                  : "bg-linen-100 text-sage-900 hover:bg-linen-200"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grouped Shopping Items */}
      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-8 text-neutral-400 font-medium text-sm">
          No ingredients listed for this filter.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedItems).map(([category, catItems]) => {
            const itemsArray = catItems as GroceryItem[];
            return (
              <div key={category} className="space-y-3" id={`category-group-${category}`}>
                <div className="flex items-center gap-2 text-xs font-black text-terracotta-500 uppercase tracking-[0.2em]">
                  <Grid className="w-3.5 h-3.5" />
                  <span>{category}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {itemsArray.map((item) => {
                    const isChecked = !!checkedItems[item.name];
                    return (
                      <button
                        key={item.name}
                        onClick={() => toggleItem(item.name)}
                        className={`w-full text-left flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                          isChecked
                            ? "bg-linen-50/40 border-linen-100 text-neutral-400"
                            : "bg-white border-linen-200 text-neutral-800 hover:border-sage-600/30 hover:bg-linen-50/20"
                        }`}
                      >
                        <div className="flex items-center gap-3 pr-2 min-w-0">
                          <div className="shrink-0">
                            {isChecked ? (
                              <div className="w-5 h-5 bg-sage-600 rounded-md flex items-center justify-center transition-transform duration-100 scale-100">
                                <Check className="w-3.5 h-3.5 text-white stroke-[3px]" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 border-2 border-linen-200 rounded-md hover:border-sage-600/30" />
                            )}
                          </div>
                          <span className={`text-xs font-bold truncate ${isChecked ? "line-through decoration-neutral-300 font-semibold" : ""}`}>
                            {item.name}
                          </span>
                        </div>
                        <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold shrink-0 ${isChecked ? "bg-linen-100 text-neutral-400" : "bg-sage-50 text-sage-900"}`}>
                          {item.quantity}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
