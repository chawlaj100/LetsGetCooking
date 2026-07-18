import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API endpoint to generate the meal plan
app.post("/api/mealplan", async (req, res) => {
  try {
    const { prompt, budgetLimit, excludedIngredients, allergens } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Daily context prompt is required." });
    }

    const limitNum = Number(budgetLimit) || 20;
    const exList = Array.isArray(excludedIngredients) ? excludedIngredients : [];
    const allergenList = Array.isArray(allergens) ? allergens : [];

    const systemInstruction = `You are an expert culinary AI nutritionist and meal planning coach. Your goal is to design a realistic, practical, and highly optimized daily meal plan (Breakfast, Lunch, and Dinner) tailored to the user's specific daily schedule constraints, allergens, budget, and ingredient availability.

Rules:
1. Adjust meal preparation times and complexity to fit the user's schedule (e.g., fast/no-cook meals if they work late or are very busy).
2. Absolutely DO NOT include any allergens, out-of-stock items, or excluded ingredients in the main recipe steps of any meal.
3. Generate direct 1:1 substitutions in the 'substitutions' field for any missing/excluded item or specified allergens (especially if they state they are out of an item in their prompt).
4. Calculate grocery costs based on average US retail/market prices. Compare with budget limit of $${limitNum}. Set status to 'UNDER_BUDGET' if the cost is <= $${limitNum}, or 'OVER_BUDGET' if > $${limitNum}.
5. Aggregate and categorize all grocery items into Produce, Dairy, Pantry, Meat, Bakery, Spices, etc. Deduplicate them into a clean, precise list.
6. Provide clear instructions and everyday, easy-to-cook recipes. Do not use extremely expensive or exotic ingredients.`;

    const userPrompt = `Generate a daily meal plan based on the following context:
- User Schedule & Preferences: "${prompt}"
- Daily Budget Limit: $${limitNum}
- Excluded Ingredients: [${exList.join(", ")}]
- Allergens: [${allergenList.join(", ")}]

Ensure all JSON constraints are satisfied. Do not refer to missing ingredients or allergens in the main ingredients, but supply substitutions.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            meals: {
              type: Type.OBJECT,
              properties: {
                breakfast: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    prepTime: { type: Type.INTEGER, description: "Prep/cooking time in minutes" },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Step-by-step chronological list of instructions to prepare this meal"
                    }
                  },
                  required: ["name", "prepTime", "steps"]
                },
                lunch: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    prepTime: { type: Type.INTEGER, description: "Prep/cooking time in minutes" },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Step-by-step chronological list of instructions to prepare this meal"
                    }
                  },
                  required: ["name", "prepTime", "steps"]
                },
                dinner: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    prepTime: { type: Type.INTEGER, description: "Prep/cooking time in minutes" },
                    steps: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "Step-by-step chronological list of instructions to prepare this meal"
                    }
                  },
                  required: ["name", "prepTime", "steps"]
                }
              },
              required: ["breakfast", "lunch", "dinner"]
            },
            groceryList: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  quantity: { type: Type.STRING, description: "Quantity needed, e.g. '1/2 lb', '1 can', '3 units'" },
                  category: { type: Type.STRING, description: "e.g. 'Produce', 'Dairy', 'Pantry', 'Meat', etc." }
                },
                required: ["name", "quantity", "category"]
              }
            },
            substitutions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  original: { type: Type.STRING, description: "The original missing or allergen ingredient" },
                  substitute: { type: Type.STRING, description: "Immediate 1:1 substitute" },
                  reason: { type: Type.STRING, description: "Reason why this substitution fits perfectly" }
                },
                required: ["original", "substitute", "reason"]
              }
            },
            budget: {
              type: Type.OBJECT,
              properties: {
                estimatedCost: { type: Type.NUMBER, description: "Total grocery list cost in USD" },
                status: { type: Type.STRING, enum: ["UNDER_BUDGET", "OVER_BUDGET"] },
                justification: { type: Type.STRING },
                cheapSuggestion: { type: Type.STRING, description: "Chef's tip to save money or direct substitute if OVER_BUDGET" }
              },
              required: ["estimatedCost", "status", "justification"]
            }
          },
          required: ["meals", "groceryList", "substitutions", "budget"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response returned from Gemini API.");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error in meal plan API:", error);
    res.status(500).json({ error: error?.message || "An error occurred while generating your meal plan." });
  }
});

// Serve frontend with Vite in dev, static files in prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Server] Running on http://localhost:${PORT}`);
  });
}

startServer();
