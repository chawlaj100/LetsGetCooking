# Bento AI • AI Meal Planner & Budget Optimizer

Bento AI is a lightweight, AI-powered meal planning micro-app designed to defeat decision fatigue, optimize grocery spending, and match your active calendar schedule. 

Built with **React (Vite)**, **Tailwind CSS (v4)**, **Express**, and the official **Google Gen AI SDK (`@google/genai`)**, Bento AI analyzes your daily schedule constraints, allergen requirements, and budget limits to generate an optimized, realistic, and delicious daily meal plan.

---

## 🌟 Key Features

### 1. Daily Schedule-Optimized Meal Plans
* Generates balanced, realistic recipes for **Breakfast, Lunch, and Dinner**.
* Chronological, step-by-step cooking to-do lists that match your active daily time constraints (e.g., fast assembly for packed workdays).

### 2. Smart Grocery List Aggregator
* Automatically aggregates all raw ingredients across the generated meals into a single, deduplicated shopping list.
* Categorizes ingredients (Produce, Dairy, Pantry, Meat, etc.) with precise quantities.
* Includes interactive checkboxes to track purchased items.

### 3. Budget Feasibility Engine
* Estimates ingredient costs based on standard market averages.
* Features a visual budget progress bar showing target vs. actual cost.
* Actively suggests cheaper ingredient alternatives and cost-saving tips if your plan is over budget.

### 4. Smart Substitutions
* Automatically triggers 1:1 ingredient substitutions for allergens or pantry deficits specified in your prompt (e.g., substituting Roasted Red Pepper when out of tomatoes).

---

## 🎨 Visual Identity & Aesthetic

Bento AI is styled with a gorgeous **"Natural Tones"** theme, featuring:
* **Organic Warm Canvas:** Soft off-white backgrounds (`#FDFCF8`) and warm linen tones (`#F2EFE9`).
* **Serene Botanical Accents:** Soft leaf sage green (`#5A6B5D`) and deep botanical charcoal for primary typography.
* **Warm Terracotta Accents:** Gentle earthy tones (`#D48C70`) for category badges, highlights, and substitutions.
* **Refined Typography:** Pairings of the elegant **Lora Serif** typeface for display titles and headings with **Plus Jakarta Sans** for responsive UI controls.

---

## 🛠️ Technical Stack

* **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons, and Motion.
* **Backend:** Node.js, Express, tsx.
* **AI Orchestration:** Google Gen AI SDK (`@google/genai`) utilizing `gemini-3.5-flash` with a strict JSON schema schema definition.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
```

### 3. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

---

## 📦 Production Build & Deploy

Compile both the React single page application and bundle the Express backend into `dist/`:
```bash
npm run build
```

Launch the production environment:
```bash
npm run start
```
