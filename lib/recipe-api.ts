export interface Ingredient {
  amount: string;
  name: string;
}

export interface Nutrition {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface Recipe {
  name: string;
  cuisine: string;
  description: string;
  time: string;
  difficulty: string;
  servings: number;
  ingredients: Ingredient[];
  steps: string[];
  nutrition: Nutrition;
  tips?: string;
  emoji?: string;
  calories?: number;
  rating?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberValue(value: unknown, fallback = 0) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.-]/g, ""));
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function extractJson(text: string) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1];
  const candidate = fenced || text;
  const start = candidate.indexOf("{");
  const end = candidate.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("The AI response did not include a JSON object.");
  }

  return candidate.slice(start, end + 1);
}

export function parseRecipe(text: string): Recipe {
  let parsed: unknown;
  try {
    parsed = JSON.parse(extractJson(text));
  } catch {
    throw new Error("The AI response was incomplete or invalid. Please try again.");
  }

  if (!isRecord(parsed)) {
    throw new Error("The AI response was not a recipe object.");
  }

  const ingredients = Array.isArray(parsed.ingredients)
    ? parsed.ingredients
        .filter(isRecord)
        .map((item) => ({
          amount: stringValue(item.amount, "as needed"),
          name: stringValue(item.name),
        }))
        .filter((item) => item.name)
    : [];

  const steps = Array.isArray(parsed.steps)
    ? parsed.steps.map((step) => stringValue(step)).filter(Boolean)
    : [];

  const nutrition = isRecord(parsed.nutrition) ? parsed.nutrition : {};
  const recipe: Recipe = {
    name: stringValue(parsed.name),
    cuisine: stringValue(parsed.cuisine, "Custom"),
    description: stringValue(parsed.description),
    time: stringValue(parsed.time, "Flexible"),
    difficulty: stringValue(parsed.difficulty, "Intermediate"),
    servings: Math.max(1, Math.round(numberValue(parsed.servings, 2))),
    ingredients,
    steps,
    nutrition: {
      calories: Math.max(0, Math.round(numberValue(nutrition.calories))),
      protein: Math.max(0, Math.round(numberValue(nutrition.protein))),
      carbs: Math.max(0, Math.round(numberValue(nutrition.carbs))),
      fat: Math.max(0, Math.round(numberValue(nutrition.fat))),
    },
    tips: stringValue(parsed.tips),
    emoji: stringValue(parsed.emoji),
    calories: numberValue(parsed.calories),
    rating: numberValue(parsed.rating),
  };

  if (!recipe.name || ingredients.length === 0 || steps.length === 0) {
    throw new Error("The AI recipe was missing a name, ingredients, or steps.");
  }

  return recipe;
}

async function requestClaude(prompt: string): Promise<string> {
  const response = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const errorBody: unknown = await response.json().catch(() => null);
    const message = isRecord(errorBody) && typeof errorBody.error === "string"
      ? errorBody.error
      : `API error: ${response.status}`;
    throw new Error(message);
  }

  const data: unknown = await response.json();
  if (!isRecord(data) || !Array.isArray(data.content)) {
    throw new Error("The AI response was not in the expected format.");
  }

  const text = data.content
    .filter(isRecord)
    .map((block) => typeof block.text === "string" ? block.text : "")
    .join("");

  return text;
}

export async function callClaude(prompt: string): Promise<Recipe> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const requestPrompt = attempt === 0
      ? prompt
      : `${prompt}\n\nYour previous response could not be parsed. Return one complete, strictly valid JSON object only. Escape quotation marks inside strings and do not include trailing commas or markdown.`;
    const text = await requestClaude(requestPrompt);

    try {
      return parseRecipe(text);
    } catch (error) {
      lastError = error instanceof Error ? error : new Error("The AI returned an invalid recipe.");
    }
  }

  throw lastError ?? new Error("The AI returned an invalid recipe. Please try again.");
}
