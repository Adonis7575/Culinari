"use client";

// Culinaria: multi-select dietary needs, textures, expanded cuisines, cook mode, scaling, and surprise.
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { animate, createScope, stagger } from "animejs";
import {
  ArrowRight,
  CaretDown,
  ChatCircleDots,
  ChefHat,
  Clock,
  Diamond,
  GlobeHemisphereWest,
  Leaf,
  MoonStars,
  PaperPlaneTilt,
  Plus,
  SlidersHorizontal,
  Sparkle,
  Sun,
  X,
} from "@phosphor-icons/react";
import { usePersistentState } from "../hooks/usePersistentState";
import { callClaude, type Recipe } from "../lib/recipe-api";
import "./RecipePlatform.css";

// ─── Constants ──────────────────────────────────────────────────────────────
const CUISINE_GROUPS: Record<string, string[]> = {
  "Europe": ["Italian","French","Spanish","Greek","Portuguese","German","Polish","British"],
  "Africa": ["Ethiopian","Nigerian","West African","Moroccan","Egyptian","South African"],
  "Middle East": ["Lebanese","Turkish","Persian","Israeli","Middle Eastern"],
  "South & Central Asia": ["Indian","Pakistani","Sri Lankan","Afghan"],
  "East & Southeast Asia": ["Japanese","Chinese","Korean","Thai","Vietnamese","Filipino","Indonesian","Malaysian"],
  "Americas": ["Mexican","Peruvian","Brazilian","Argentinian","Colombian","Caribbean","Jamaican","Cuban","American","Southern / Soul Food","Cajun & Creole","Hawaiian"],
  "Broad": ["Mediterranean","Fusion"],
};
const CUISINES = ["Any Cuisine", ...Object.values(CUISINE_GROUPS).flat()];

const DIET_GROUPS: Array<{ label: string; icon: string; options: string[] }> = [
  { label: "Lifestyle", icon: "◎", options: ["Vegetarian","Vegan","Pescatarian","Flexitarian","Keto","Paleo","Low-Carb","High-Protein","Whole30","Mediterranean Diet"] },
  { label: "Health Conditions", icon: "♥", options: ["Diabetic-Friendly","Heart-Healthy","Low-Sodium","Low-Cholesterol","Kidney-Friendly (Renal)","Low-FODMAP","GERD / Reflux-Friendly","Anti-Inflammatory","Low-Purine (Gout)","Low-Histamine","Low-Fiber / Low-Residue","High-Fiber","Low-Sugar","Iron-Rich (Anemia)","Pregnancy-Safe"] },
  { label: "Allergies & Intolerances", icon: "⚠", options: ["Gluten-Free","Dairy-Free","Lactose-Free","Nut-Free","Peanut-Free","Shellfish-Free","Fish-Free","Egg-Free","Soy-Free","Sesame-Free","Corn-Free","Nightshade-Free"] },
  { label: "Religious & Cultural", icon: "✦", options: ["Halal","Kosher","Hindu Vegetarian","Jain","Buddhist Vegetarian","No Pork","No Beef","No Alcohol","Lent / Fasting-Friendly"] },
];

const TEXTURES = ["Any Texture","Regular","Soft Foods (easy-chew)","Minced & Moist","Puréed","Smooth / Liquid"];
const TIMES = ["Any Time","Under 15 min","Under 30 min","Under 1 hour","1-2 hours"];
const SKILLS = ["Any Level","Beginner","Intermediate","Advanced"];
const CALORIE_OPTIONS = ["Any Calories","Under 300 cal","300-500 cal","500-700 cal","700+ cal"];
const IMPROVE_PROMPTS = ["Make it vegetarian","Reduce calories by 30%","Make it high protein","Turn into meal prep","Make it keto","Add more vegetables","Make it spicier","Reduce cooking time","Make it dairy-free","Lower the sodium","Make it diabetic-friendly","Make it soft-texture friendly (no soup)","Make it halal","Use budget ingredients","Add a flavor twist"];

const SAMPLE_RECIPES = [
  { id:1, name:"Roasted Garlic Pasta al Limone", cuisine:"Italian", time:"25 min", mins:25, calories:480, rating:4.8, emoji:"🍝", diff:"Easy", tags:["Vegetarian"] },
  { id:2, name:"Miso-Glazed Salmon Bowl", cuisine:"Japanese", time:"30 min", mins:30, calories:520, rating:4.9, emoji:"🐟", diff:"Intermediate", tags:["Pescatarian","Dairy-Free","Heart-Healthy"] },
  { id:3, name:"Smoky Black Bean Tacos", cuisine:"Mexican", time:"20 min", mins:20, calories:380, rating:4.7, emoji:"🌮", diff:"Easy", tags:["Vegan","High-Fiber"] },
  { id:4, name:"Saffron Chicken Tagine", cuisine:"Moroccan", time:"1.5 hr", mins:90, calories:610, rating:4.6, emoji:"🫕", diff:"Advanced", tags:["Halal-Friendly","Dairy-Free","Soft-Friendly"] },
  { id:5, name:"Thai Basil Fried Rice", cuisine:"Thai", time:"15 min", mins:15, calories:450, rating:4.7, emoji:"🍚", diff:"Easy", tags:["Dairy-Free"] },
  { id:6, name:"Shakshuka with Feta", cuisine:"Middle Eastern", time:"25 min", mins:25, calories:340, rating:4.8, emoji:"🍳", diff:"Easy", tags:["Vegetarian","Soft-Friendly","Low-Carb"] },
  { id:7, name:"Beef Bulgogi Bibimbap", cuisine:"Korean", time:"45 min", mins:45, calories:590, rating:4.9, emoji:"🥩", diff:"Intermediate", tags:["Dairy-Free","High-Protein"] },
  { id:8, name:"Pesto Gnocchi with Burrata", cuisine:"Italian", time:"20 min", mins:20, calories:560, rating:4.6, emoji:"🧆", diff:"Easy", tags:["Vegetarian","Soft-Friendly"] },
  { id:9, name:"Harissa Roasted Cauliflower", cuisine:"Mediterranean", time:"40 min", mins:40, calories:280, rating:4.5, emoji:"🥦", diff:"Easy", tags:["Vegan","Low-Carb","Anti-Inflammatory"] },
  { id:10, name:"Duck Confit with Cherry Jus", cuisine:"French", time:"3 hr", mins:180, calories:720, rating:4.9, emoji:"🍖", diff:"Advanced", tags:["Gluten-Free","Soft-Friendly"] },
  { id:11, name:"Paneer Butter Masala", cuisine:"Indian", time:"35 min", mins:35, calories:490, rating:4.8, emoji:"🍛", diff:"Intermediate", tags:["Vegetarian","Soft-Friendly"] },
  { id:12, name:"Avocado Tuna Poke Bowl", cuisine:"Hawaiian", time:"15 min", mins:15, calories:430, rating:4.7, emoji:"🥑", diff:"Easy", tags:["Pescatarian","Dairy-Free","Heart-Healthy"] },
  { id:13, name:"Jollof Rice with Chicken", cuisine:"Nigerian", time:"50 min", mins:50, calories:560, rating:4.9, emoji:"🍗", diff:"Intermediate", tags:["Halal-Friendly","Dairy-Free"] },
  { id:14, name:"Doro Wat with Injera", cuisine:"Ethiopian", time:"1.5 hr", mins:90, calories:540, rating:4.8, emoji:"🍲", diff:"Intermediate", tags:["Dairy-Free","Soft-Friendly"] },
  { id:15, name:"Phở Gà (Chicken Pho)", cuisine:"Vietnamese", time:"1 hr", mins:60, calories:420, rating:4.8, emoji:"🍜", diff:"Intermediate", tags:["Dairy-Free","Gluten-Free"] },
  { id:16, name:"Chicken Adobo", cuisine:"Filipino", time:"45 min", mins:45, calories:510, rating:4.7, emoji:"🍛", diff:"Easy", tags:["Dairy-Free","Soft-Friendly"] },
  { id:17, name:"Lomo Saltado", cuisine:"Peruvian", time:"30 min", mins:30, calories:580, rating:4.7, emoji:"🥘", diff:"Intermediate", tags:["Dairy-Free"] },
  { id:18, name:"Jerk Chicken with Rice & Peas", cuisine:"Jamaican", time:"1 hr", mins:60, calories:620, rating:4.8, emoji:"🌶️", diff:"Intermediate", tags:["Dairy-Free","Gluten-Free"] },
  { id:19, name:"Mujadara (Lentils & Rice)", cuisine:"Lebanese", time:"40 min", mins:40, calories:390, rating:4.6, emoji:"🫘", diff:"Easy", tags:["Vegan","Diabetic-Friendly","Soft-Friendly","High-Fiber"] },
  { id:20, name:"Shrimp & Grits", cuisine:"Southern / Soul Food", time:"35 min", mins:35, calories:550, rating:4.8, emoji:"🦐", diff:"Intermediate", tags:["Gluten-Free","Soft-Friendly"] },
  { id:21, name:"İmam Bayıldı (Stuffed Eggplant)", cuisine:"Turkish", time:"1 hr", mins:60, calories:310, rating:4.6, emoji:"🍆", diff:"Intermediate", tags:["Vegan","Heart-Healthy","Soft-Friendly"] },
  { id:22, name:"Khoresh Fesenjan", cuisine:"Persian", time:"1.5 hr", mins:90, calories:600, rating:4.7, emoji:"🍯", diff:"Advanced", tags:["Dairy-Free","Gluten-Free","Soft-Friendly"] },
  { id:23, name:"Feijoada Vegetariana", cuisine:"Brazilian", time:"1 hr", mins:60, calories:470, rating:4.5, emoji:"🍳", diff:"Intermediate", tags:["Vegan","High-Fiber","Soft-Friendly"] },
  { id:24, name:"Gumbo with Okra", cuisine:"Cajun & Creole", time:"1.5 hr", mins:90, calories:530, rating:4.8, emoji:"🥣", diff:"Advanced", tags:["Dairy-Free","Soft-Friendly"] },
];

const PANTRY_ITEMS: PantryItem[] = [
  { name:"Chicken Breast", qty:"500g", status:"ok" },
  { name:"Garlic", qty:"1 bulb", status:"ok" },
  { name:"Cherry Tomatoes", qty:"250g", status:"ok" },
  { name:"Pasta (spaghetti)", qty:"200g", status:"low" },
  { name:"Olive Oil", qty:"250ml", status:"ok" },
  { name:"Parmesan", qty:"80g", status:"low" },
  { name:"Lemon", qty:"2", status:"ok" },
  { name:"Eggs", qty:"4", status:"ok" },
];

const MEAL_PLAN: MealPlan = {
  Mon: { b:"Greek Yogurt Parfait", l:"Chicken Caesar Wrap", d:"Salmon Teriyaki", cal:1820 },
  Tue: { b:"Avocado Toast", l:"Lentil Soup", d:"Beef Stir Fry", cal:1750 },
  Wed: { b:"Overnight Oats", l:"Caprese Salad", d:"Pasta Primavera", cal:1680 },
  Thu: { b:"Smoothie Bowl", l:"Turkey Panini", d:"Chicken Tikka", cal:1900 },
  Fri: { b:"Eggs Benedict", l:"Poke Bowl", d:"Margherita Pizza", cal:1980 },
  Sat: { b:"French Toast", l:"Caesar Salad", d:"BBQ Ribs", cal:2100 },
  Sun: { b:"Shakshuka", l:"Mezze Platter", d:"Roast Chicken", cal:1850 },
};

const PLAN_DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const BREAKFAST_POOL = ["Greek Yogurt Parfait","Avocado Toast","Overnight Oats","Smoothie Bowl","Eggs Benedict","French Toast","Shakshuka"];
const LUNCH_POOL = ["Chicken Caesar Wrap","Lentil Soup","Caprese Salad","Turkey Panini","Poke Bowl","Caesar Salad","Mezze Platter"];
const DINNER_POOL = ["Salmon Teriyaki","Beef Stir Fry","Pasta Primavera","Chicken Tikka","Margherita Pizza","BBQ Ribs","Roast Chicken"];

// ─── Types ───────────────────────────────────────────────────────────────────
type PantryStatus = "ok" | "low";
type MealKey = "b" | "l" | "d";
type MealPlan = Record<string, { b: string; l: string; d: string; cal: number }>;

interface PantryItem { name: string; qty: string; status: PantryStatus; }

const STORAGE_KEYS = {
  saved: "culina.savedRecipes.v1",
  pantry: "culina.pantryItems.v1",
  mealPlan: "culina.mealPlan.v1",
  theme: "culina.theme.v1",
};
const EMPTY_RECIPES: Recipe[] = [];
type ThemeMode = "light" | "dark";
type FeedbackStatus = "idle" | "sending" | "sent" | "error";

function textureInstruction(texture: string) {
  if (!texture || texture === "Any Texture" || texture === "Regular") return "";
  const base = `Texture requirement: ${texture}. CRITICAL: do NOT default to soup. Offer varied casseroles, braises, egg dishes, flaky fish, slow-cooked stews, soft grain bowls, polenta, risotto, well-cooked legumes, and soft desserts. `;
  const detail: Record<string, string> = {
    "Soft Foods (easy-chew)": "Everything must be tender and easy to chew with no hard, crunchy, tough, or stringy elements. A fork should cut every component.",
    "Minced & Moist": "All components finely minced (≤4mm pieces) and served moist with sauce or gravy. No hard lumps or dry textures.",
    "Puréed": "Every component must be smooth-puréed with no lumps. Purée components separately to preserve distinct flavors and colors; suggest plating that keeps them appetizing.",
    "Smooth / Liquid": "Fully smooth, drinkable or spoonable consistency throughout. Think savory blends, smoothies, and enriched creams, strained where needed.",
  };
  return base + (detail[texture] || "");
}

function buildRecipePrompt(p: {ingredients:string[];cuisine:string;diets:string[];customDiet:string;texture:string;time:string;skill:string;calories:string}) {
  const ing = p.ingredients.length ? p.ingredients.join(", ") : "pantry staples";
  const diets = p.diets.length ? p.diets.join(", ") : "none";
  const textureNote = textureInstruction(p.texture);
  return `You are a world-class chef AI with deep knowledge of global cuisines and clinical/cultural dietary needs. Create a restaurant-quality recipe.

Ingredients: ${ing}
Cuisine: ${p.cuisine || "any"} (be authentic to the cuisine's techniques and flavor traditions)
Dietary requirements (ALL must be strictly satisfied): ${diets}
${p.customDiet ? `Custom restrictions/notes from the user (treat as hard requirements): ${p.customDiet}` : ""}
${textureNote ? textureNote : ""}
Time: ${p.time || "flexible"}
Skill: ${p.skill || "intermediate"}
Calories: ${p.calories || "flexible"}

If dietary requirements conflict with an ingredient, substitute it appropriately and mention the swap in tips.
For allergies or medical diets, avoid claims that the recipe is medically safe. Remind the user in tips to verify packaged ingredients and cross-contamination risks when relevant.

Respond ONLY with valid JSON, no markdown:
{"name":"...","cuisine":"...","description":"...","time":"...","difficulty":"Easy|Intermediate|Advanced","servings":2,"ingredients":[{"amount":"...","name":"..."}],"steps":["..."],"nutrition":{"calories":0,"protein":0,"carbs":0,"fat":0},"tips":"..."}`;
}

function buildImprovePrompt(recipe: Recipe, instruction: string) {
  return `Modify this recipe per the instruction. Return ONLY valid JSON in the same schema.

Recipe: ${JSON.stringify(recipe)}
Instruction: "${instruction}"`;
}

function buildDiscoverPrompt(card: { name:string; cuisine:string; time:string; calories:number; diff:string }) {
  return `You are a world-class chef AI. Generate the complete, authentic recipe for "${card.name}", a ${card.cuisine} dish.

Target: ~${card.calories} cal, ${card.time} cook time, ${card.diff} difficulty.

Respond ONLY with valid JSON, no markdown:
{"name":"${card.name}","cuisine":"${card.cuisine}","description":"...","time":"${card.time}","difficulty":"${card.diff}","servings":2,"ingredients":[{"amount":"...","name":"..."}],"steps":["..."],"nutrition":{"calories":${card.calories},"protein":0,"carbs":0,"fat":0},"tips":"..."}`;
}

function buildMealPlan(savedRecipes: Recipe[], seed = Date.now()): MealPlan {
  const savedNames = savedRecipes.map(recipe => recipe.name).filter(Boolean);
  const lunchPool = [...savedNames, ...LUNCH_POOL, ...SAMPLE_RECIPES.map(recipe => recipe.name)];
  const dinnerPool = [...SAMPLE_RECIPES.map(recipe => recipe.name), ...savedNames, ...DINNER_POOL];
  const offset = Math.floor(seed / 1000) % 997;

  return PLAN_DAYS.reduce<MealPlan>((plan, day, index) => ({
    ...plan,
    [day]: {
      b: BREAKFAST_POOL[(index + offset) % BREAKFAST_POOL.length],
      l: lunchPool[(index * 2 + offset) % lunchPool.length],
      d: dinnerPool[(index * 3 + offset) % dinnerPool.length],
      cal: 1650 + ((index * 83 + offset) % 500),
    },
  }), {});
}

// ─── Serving scaler ──────────────────────────────────────────────────────────
const UNICODE_FRACTIONS: Record<string, number> = { "¼":0.25, "½":0.5, "¾":0.75, "⅓":1/3, "⅔":2/3, "⅛":0.125, "⅜":0.375, "⅝":0.625, "⅞":0.875 };

function parseLeadingQuantity(amount: string): { value: number; rest: string } | null {
  const m = amount.trim().match(/^(\d+\s+\d+\/\d+|\d+\/\d+|\d*[¼½¾⅓⅔⅛⅜⅝⅞]|\d+(?:[.,]\d+)?)\s*(.*)$/);
  if (!m) return null;
  const raw = m[1];
  let value: number;
  if (raw.includes("/")) {
    const parts = raw.split(/\s+/);
    value = parts.length === 2
      ? parseInt(parts[0], 10) + (() => { const [n, d] = parts[1].split("/").map(Number); return d ? n / d : 0; })()
      : (() => { const [n, d] = raw.split("/").map(Number); return d ? n / d : NaN; })();
  } else {
    const uni = raw.match(/[¼½¾⅓⅔⅛⅜⅝⅞]/)?.[0];
    if (uni) {
      const whole = raw.replace(uni, "");
      value = (whole ? parseInt(whole, 10) : 0) + UNICODE_FRACTIONS[uni];
    } else {
      value = parseFloat(raw.replace(",", "."));
    }
  }
  if (!Number.isFinite(value)) return null;
  return { value, rest: m[2] };
}

function formatQuantity(value: number): string {
  const whole = Math.floor(value + 1e-6);
  const frac = value - whole;
  const NICE: Array<[number, string]> = [[0,""],[0.125,"⅛"],[0.25,"¼"],[1/3,"⅓"],[0.375,"⅜"],[0.5,"½"],[0.625,"⅝"],[2/3,"⅔"],[0.75,"¾"],[0.875,"⅞"],[1,""]];
  let best = NICE[0]; let bestDiff = Infinity;
  for (const cand of NICE) { const d = Math.abs(frac - cand[0]); if (d < bestDiff) { bestDiff = d; best = cand; } }
  if (bestDiff <= 0.04) {
    const w = whole + (best[0] === 1 ? 1 : 0);
    const f = best[0] === 1 ? "" : best[1];
    if (!w && !f) return "0";
    return `${w || (f ? "" : w)}${w && f ? " " : ""}${f}` || String(w);
  }
  return value < 10 ? String(Math.round(value * 100) / 100) : String(Math.round(value));
}

function scaleAmount(amount: string, factor: number): string {
  if (factor === 1) return amount;
  const parsed = parseLeadingQuantity(amount);
  if (!parsed) return amount;
  return `${formatQuantity(parsed.value * factor)}${parsed.rest ? " " + parsed.rest : ""}`.trim();
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts }: { toasts: Array<{id:number;msg:string;icon:string}> }) {
  return (
    <div className="toast-container" role="status" aria-live="polite" aria-atomic="true">
      {toasts.map(t => (
        <div key={t.id} className="toast">{t.icon} {t.msg}</div>
      ))}
    </div>
  );
}

function trapDialogFocus(event: React.KeyboardEvent<HTMLDivElement>) {
  if (event.key !== "Tab") return;

  const focusable = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
    )
  ).filter(element => !element.hasAttribute("hidden"));

  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

// ─── Private feedback ────────────────────────────────────────────────────────
function FeedbackWidget({ currentView }: { currentView: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<FeedbackStatus>("idle");
  const [error, setError] = useState("");
  const widgetRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;

    const focusTimer = window.setTimeout(() => messageRef.current?.focus(), 0);
    const handlePointerDown = (event: PointerEvent) => {
      if (!widgetRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedMessage = message.trim();
    if (trimmedMessage.length < 3) {
      setStatus("error");
      setError("Please share at least a few words.");
      messageRef.current?.focus();
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmedMessage,
          email: email.trim(),
          website,
          page: currentView,
          url: window.location.href,
        }),
      });
      const data: unknown = await response.json().catch(() => null);
      const detail = data && typeof data === "object" && "error" in data && typeof data.error === "string"
        ? data.error
        : "Feedback could not be sent. Please try again.";

      if (!response.ok) throw new Error(detail);

      setMessage("");
      setEmail("");
      setWebsite("");
      setStatus("sent");
    } catch (submitError: unknown) {
      setStatus("error");
      setError(submitError instanceof Error ? submitError.message : "Feedback could not be sent. Please try again.");
    }
  };

  const toggleOpen = () => {
    setOpen(previous => {
      if (!previous) {
        setStatus("idle");
        setError("");
      }
      return !previous;
    });
  };

  return (
    <div className="feedback-widget" ref={widgetRef}>
      {open && (
        <section
          id="private-feedback-panel"
          className="feedback-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="feedback-title"
        >
          <div className="feedback-panel-head">
            <div>
              <p className="feedback-kicker">Private note</p>
              <h2 id="feedback-title">Share feedback</h2>
            </div>
            <button
              type="button"
              className="feedback-close"
              aria-label="Close feedback form"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
            >
              <X size={18} weight="bold" aria-hidden="true" />
            </button>
          </div>

          {status === "sent" ? (
            <div className="feedback-success" role="status">
              <span aria-hidden="true">✓</span>
              <div>
                <strong>Thank you.</strong>
                <p>Your feedback was sent privately.</p>
              </div>
              <button type="button" className="feedback-secondary" onClick={() => setStatus("idle")}>
                Send another note
              </button>
            </div>
          ) : (
            <form className="feedback-form" onSubmit={handleSubmit}>
              <label htmlFor="feedback-message">What could be better?</label>
              <textarea
                ref={messageRef}
                id="feedback-message"
                value={message}
                minLength={3}
                maxLength={1600}
                required
                placeholder="A quick thought, bug, or idea..."
                onChange={event => {
                  setMessage(event.target.value);
                  if (status === "error") setStatus("idle");
                }}
              />
              <div className="feedback-field-row">
                <label htmlFor="feedback-email">Email <span>(optional, for a reply)</span></label>
                <input
                  id="feedback-email"
                  type="email"
                  value={email}
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                  onChange={event => setEmail(event.target.value)}
                />
              </div>
              <div className="feedback-honeypot" aria-hidden="true">
                <label htmlFor="feedback-website">Website</label>
                <input
                  id="feedback-website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={event => setWebsite(event.target.value)}
                />
              </div>
              {status === "error" && <p className="feedback-error" role="alert">{error}</p>}
              <div className="feedback-form-foot">
                <p>Your note goes only to the Culinaria owner.</p>
                <button type="submit" className="feedback-submit" disabled={status === "sending"}>
                  <PaperPlaneTilt size={17} weight="fill" aria-hidden="true" />
                  {status === "sending" ? "Sending..." : "Send privately"}
                </button>
              </div>
            </form>
          )}
        </section>
      )}

      <button
        ref={triggerRef}
        type="button"
        className="feedback-trigger"
        aria-expanded={open}
        aria-controls="private-feedback-panel"
        onClick={toggleOpen}
      >
        <ChatCircleDots size={20} weight="duotone" aria-hidden="true" />
        <span>Feedback</span>
      </button>
    </div>
  );
}

// ─── RecipeOutput ─────────────────────────────────────────────────────────────
function RecipeOutput({ recipe, saved, onSave, onImprove, onAddToPlanner, onToast }: {
  recipe: Recipe; saved: boolean;
  onSave: () => void; onImprove: (i: string) => void;
  onAddToPlanner?: (day: string, meal: MealKey) => void;
  onToast?: (msg: string, icon?: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [pickerDay, setPickerDay] = useState("Mon");
  const [pickerMeal, setPickerMeal] = useState<MealKey>("d");
  const [cookMode, setCookMode] = useState(false);
  const [checkedIng, setCheckedIng] = useState<Set<number>>(new Set());
  const [checkedSteps, setCheckedSteps] = useState<Set<number>>(new Set());
  const [servings, setServings] = useState(recipe.servings || 2);
  const DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

  const factor = (recipe.servings || 1) > 0 ? servings / (recipe.servings || 1) : 1;
  const toggleSet = (set: Set<number>, i: number) => {
    const next = new Set(set);
    if (next.has(i)) next.delete(i); else next.add(i);
    return next;
  };
  const stepProgress = recipe.steps?.length ? Math.round((checkedSteps.size / recipe.steps.length) * 100) : 0;

  const copyText = async (text: string, success: string) => {
    try {
      await navigator.clipboard.writeText(text);
      onToast?.(success, "✓");
    } catch {
      onToast?.("Copy failed", "!");
    }
  };

  return (
    <article className="recipe-output" aria-labelledby="generated-recipe-title">
      <div className="recipe-header">
        <div className="recipe-cuisine-tag">✦ {recipe.cuisine}</div>
        <h2 id="generated-recipe-title" className="recipe-name">{recipe.name}</h2>
        <p className="recipe-desc">{recipe.description}</p>
        <div className="recipe-meta">
          {[["Time", `⏱ ${recipe.time}`],["Difficulty",`◆ ${recipe.difficulty}`],["Calories / serving",`🔥 ${recipe.nutrition?.calories}`]].map(([label,val])=>(
            <div key={label} className="recipe-meta-item">
              <span className="recipe-meta-label">{label}</span>
              <span className="recipe-meta-val">{val}</span>
            </div>
          ))}
          <div className="recipe-meta-item">
            <span className="recipe-meta-label">Servings</span>
            <span className="serving-stepper">
              <button type="button" className="serving-btn" aria-label="Decrease servings" disabled={servings <= 1} onClick={()=>setServings(s=>Math.max(1,s-1))}>−</button>
              <span className="recipe-meta-val serving-count" aria-live="polite">◎ {servings}</span>
              <button type="button" className="serving-btn" aria-label="Increase servings" disabled={servings >= 24} onClick={()=>setServings(s=>Math.min(24,s+1))}>+</button>
            </span>
            {factor !== 1 && <span className="serving-note">amounts ×{Math.round(factor*100)/100}</span>}
          </div>
        </div>
      </div>
      <div className="recipe-body">
        <div>
          <h3 className="recipe-section-title">◎ Ingredients</h3>
          <ul className="ingredient-list">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} className={`ingredient-item${cookMode?" checkable":""}${cookMode&&checkedIng.has(i)?" checked":""}`}
                role={cookMode ? "checkbox" : undefined}
                aria-checked={cookMode ? checkedIng.has(i) : undefined}
                tabIndex={cookMode ? 0 : undefined}
                onClick={cookMode ? ()=>setCheckedIng(s=>toggleSet(s,i)) : undefined}
                onKeyDown={cookMode ? event => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setCheckedIng(s=>toggleSet(s,i));
                  }
                } : undefined}>
                {cookMode && <span className={`check-box${checkedIng.has(i)?" on":""}`}>{checkedIng.has(i)?"✓":""}</span>}
                <span className="ingredient-amount">{scaleAmount(ing.amount, factor)}</span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
          {recipe.tips && (
            <aside className="recipe-tip">
              <strong className="recipe-tip-label">Pro tip</strong>
              {recipe.tips}
            </aside>
          )}
        </div>
        <div>
          <div className="recipe-section-title" style={{justifyContent:"space-between"}}>
            <h3 className="recipe-section-heading">◈ Instructions</h3>
            <button type="button" className={`cook-mode-toggle${cookMode?" on":""}`} aria-pressed={cookMode} onClick={()=>setCookMode(m=>!m)}>
              {cookMode ? "✓ Cooking" : "👨‍🍳 Cook Mode"}
            </button>
          </div>
          {cookMode && (
            <div className="cook-progress">
              <div className="cook-progress-bar" role="progressbar" aria-label="Cooking progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={stepProgress}>
                <div className="cook-progress-fill" style={{width:`${stepProgress}%`}}/>
              </div>
              <span className="cook-progress-label">{checkedSteps.size}/{recipe.steps?.length || 0} steps{stepProgress===100?", bon appétit! 🎉":""}</span>
            </div>
          )}
          <ol className="step-list">
            {recipe.steps?.map((step, i) => (
              <li key={i} className={`step-item${cookMode?" checkable":""}${cookMode&&checkedSteps.has(i)?" checked":""}`}
                role={cookMode ? "checkbox" : undefined}
                aria-checked={cookMode ? checkedSteps.has(i) : undefined}
                tabIndex={cookMode ? 0 : undefined}
                onClick={cookMode ? ()=>setCheckedSteps(s=>toggleSet(s,i)) : undefined}
                onKeyDown={cookMode ? event => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    setCheckedSteps(s=>toggleSet(s,i));
                  }
                } : undefined}>
                <span className="step-num">{cookMode&&checkedSteps.has(i)?"✓":i+1}</span>
                <span className="step-text">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        {recipe.nutrition && (
          <div className="nutrition-grid">
            {([["Calories", recipe.nutrition.calories, "kcal"],["Protein", recipe.nutrition.protein, "g"],["Carbs", recipe.nutrition.carbs, "g"],["Fat", recipe.nutrition.fat, "g"]] as [string,number,string][]).map(([label,val,unit])=>(
              <div key={label} className="nutrition-item">
                <span className="nutrition-val">{val}<small style={{fontSize:"0.9rem",opacity:0.5}}>{unit}</small></span>
                <span className="nutrition-label">{label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="improve-panel">
          <div className="improve-title">✦ AI Improvements</div>
          <div className="improve-chips">
            {IMPROVE_PROMPTS.map(p => (
              <button type="button" key={p} className="improve-chip" onClick={() => onImprove(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div className="recipe-actions">
          <button type="button" className={`btn-action${saved?" saved":""}`} aria-pressed={saved} onClick={onSave}>
            {saved ? "✓ Saved" : "♡ Save Recipe"}
          </button>
          <button type="button" className="btn-action" onClick={() => {
            const txt = `${recipe.name} (serves ${servings})\n\nIngredients:\n${recipe.ingredients?.map(i=>`${scaleAmount(i.amount, factor)} ${i.name}`).join('\n')}\n\nSteps:\n${recipe.steps?.map((s,i)=>`${i+1}. ${s}`).join('\n')}`;
            copyText(txt, "Recipe copied");
          }}>↗ Copy</button>
          <button type="button" className="btn-action" onClick={() => {
            const list = `${recipe.name}: Grocery List (serves ${servings})\n\n${recipe.ingredients?.map(i=>`• ${scaleAmount(i.amount, factor)} ${i.name}`).join('\n')}`;
            copyText(list, "Grocery list copied");
          }}>🛒 Grocery List</button>
          <div style={{position:"relative"}}>
            <button type="button" className="btn-action" aria-expanded={showPicker} onClick={() => setShowPicker(p=>!p)}>📅 Add to Planner</button>
            {showPicker && (
              <div className="planner-picker-panel" role="group" aria-label="Choose meal plan slot">
                <div>
                  <div className="planner-picker-label">Day</div>
                  <div className="picker-day-grid">
                    {DAYS.map(d=>(
                      <button type="button" key={d} className={`picker-chip${pickerDay===d?" active":""}`} aria-pressed={pickerDay===d} onClick={()=>setPickerDay(d)}>{d}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="planner-picker-label">Meal</div>
                  <div className="picker-meal-row">
                    {([["b","Breakfast"],["l","Lunch"],["d","Dinner"]] as const).map(([k,label])=>(
                      <button type="button" key={k} className={`picker-chip${pickerMeal===k?" active":""}`} aria-pressed={pickerMeal===k} onClick={()=>setPickerMeal(k)}>{label}</button>
                    ))}
                  </div>
                </div>
                <button type="button" className="btn-picker-confirm" onClick={()=>{onAddToPlanner?.(pickerDay,pickerMeal);setShowPicker(false);}}>
                  Add to Plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── GeneratorPage ────────────────────────────────────────────────────────────
function GeneratorPage({ onSave, savedIds, initialIngredients, onAddToPlanner, onToast }: {
  onSave: (r:Recipe)=>void; savedIds: Set<string>;
  initialIngredients?: string[];
  onAddToPlanner: (recipe: Recipe, day: string, meal: MealKey) => void;
  onToast: (msg: string, icon?: string) => void;
}) {
  const [ingredients, setIngredients] = useState<string[]>(
    initialIngredients?.length ? initialIngredients : ["chicken", "garlic", "tomatoes", "lemon"]
  );

  const [input, setInput] = useState("");
  const [cuisine, setCuisine] = useState("Any Cuisine");
  const [diets, setDiets] = useState<string[]>([]);
  const [customDiet, setCustomDiet] = useState("");
  const [texture, setTexture] = useState("Any Texture");
  const [time, setTime] = useState("Any Time");
  const [skill, setSkill] = useState("Any Level");
  const [calories, setCalories] = useState("Any Calories");
  const [showDietPanel, setShowDietPanel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [improving, setImproving] = useState(false);

  const addIngredient = () => {
    const v = input.trim().toLowerCase();
    if (v && !ingredients.includes(v)) setIngredients(p => [...p, v]);
    setInput("");
  };

  const toggleDiet = (d: string) => {
    setDiets(p => p.includes(d) ? p.filter(x => x !== d) : [...p, d]);
  };

  const runGenerate = async (params: {ingredients:string[];cuisine:string;diets:string[];customDiet:string;texture:string;time:string;skill:string;calories:string}) => {
    setLoading(true); setError(null); setRecipe(null);
    try {
      const result = await callClaude(buildRecipePrompt(params));
      setRecipe(result);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "Unknown error";
      setError(`Generation failed: ${msg}`);
    }
    finally { setLoading(false); }
  };

  const generate = () => runGenerate({ ingredients, cuisine, diets, customDiet, texture, time, skill, calories });

  const QUICK = ["chicken","garlic","tomatoes","pasta","lemon","onion","ginger","rice","eggs","cheese"];

  const surprise = () => {
    const pool = CUISINES.filter(c => c !== "Any Cuisine");
    const randomCuisine = pool[Math.floor(Math.random() * pool.length)];
    const baseIngredients = ingredients.length
      ? ingredients
      : [...QUICK].sort(() => Math.random() - 0.5).slice(0, 3);
    setCuisine(randomCuisine);
    if (!ingredients.length) setIngredients(baseIngredients);
    runGenerate({ ingredients: baseIngredients, cuisine: randomCuisine, diets, customDiet, texture, time, skill, calories });
  };

  const improve = async (instruction: string) => {
    if (!recipe || improving) return;
    setImproving(true);
    try {
      const result = await callClaude(buildImprovePrompt(recipe, instruction));
      setRecipe(result);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "Unknown error";
      setError(`Improvement failed: ${msg}`);
    }
    finally { setImproving(false); }
  };

  const useEditorialLayout = true;
  if (useEditorialLayout) {
    return (
      <div className="page generator-page">
        <section className="editorial-hero" aria-labelledby="generator-heading">
          <div className="editorial-copy">
            <div className="editorial-eyebrow">
              <span className="editorial-eyebrow-line" aria-hidden="true" />
              <span>AI-Powered Recipe Creation</span>
              <span className="editorial-eyebrow-line" aria-hidden="true" />
            </div>
            <h1 id="generator-heading" className="editorial-title">
              Turn what<br />
              you have into<br />
              something
              <em>extraordinary.</em>
            </h1>
            <p className="editorial-subtitle">
              Tell us what you have. Our AI generates complete, restaurant-quality recipes tailored to your taste, diet, and time.
            </p>
          </div>

          <div className="editorial-visual" role="img" aria-label="Herb roasted chicken with tomatoes, garlic, and lemon">
            <div className="editorial-slice editorial-slice-one" aria-hidden="true">
              <Image src="/images/editorial/chicken-hero.webp" alt="" width={650} height={650} priority />
            </div>
            <div className="editorial-slice editorial-slice-two" aria-hidden="true">
              <Image src="/images/editorial/chicken-hero.webp" alt="" width={650} height={650} priority />
            </div>
            <div className="editorial-slice editorial-slice-three" aria-hidden="true">
              <Image src="/images/editorial/chicken-hero.webp" alt="" width={650} height={650} priority />
            </div>

            <div className="ingredient-note ingredient-note-chicken">
              <span>chicken</span>
              <Image src="/images/editorial/basil.webp" alt="" width={68} height={68} />
            </div>
            <div className="ingredient-note ingredient-note-garlic">
              <span>garlic</span>
              <Image src="/images/editorial/garlic.webp" alt="" width={68} height={68} />
            </div>
            <div className="ingredient-note ingredient-note-tomato">
              <span>tomatoes</span>
              <Image src="/images/editorial/tomato.webp" alt="" width={68} height={68} />
            </div>
            <div className="ingredient-note ingredient-note-lemon">
              <span>lemon</span>
              <Image src="/images/editorial/lemon.webp" alt="" width={68} height={68} />
            </div>
          </div>

          <section className="editorial-composer" aria-label="Recipe generator">
            <div className="editorial-input-row">
              <form className="editorial-input-wrap" onSubmit={event=>{event.preventDefault();addIngredient();}}>
                <Leaf className="editorial-input-icon" size={20} weight="duotone" aria-hidden="true" />
                <input
                  className="editorial-input"
                  aria-label="Add an ingredient"
                  placeholder="Add an ingredient"
                  value={input}
                  onChange={event=>setInput(event.target.value)}
                  maxLength={80}
                  autoComplete="off"
                />
                <button type="submit" className="editorial-add" aria-label="Add ingredient">
                  <Plus size={20} weight="bold" aria-hidden="true" />
                </button>
              </form>

              <div className="editorial-chip-list" aria-label="Selected ingredients">
                {ingredients.length===0 && <span className="editorial-pref-label">Add what you have on hand</span>}
                {ingredients.map(ingredient=>(
                  <span key={ingredient} className="editorial-chip">
                    {ingredient}
                    <button
                      type="button"
                      className="editorial-chip-remove"
                      aria-label={`Remove ${ingredient}`}
                      onClick={()=>setIngredients(current=>current.filter(item=>item!==ingredient))}
                    >
                      <X size={15} weight="bold" aria-hidden="true" />
                    </button>
                  </span>
                ))}
              </div>

              <button type="button" className="editorial-generate" onClick={generate} disabled={loading||improving}>
                {loading||improving ? (
                  <>
                    <Sparkle size={19} weight="fill" aria-hidden="true" />
                    <span>{loading?"Creating your recipe...":"Improving recipe..."}</span>
                  </>
                ) : (
                  <>
                    <span>Generate recipe</span>
                    <ArrowRight size={19} weight="bold" aria-hidden="true" />
                  </>
                )}
              </button>

              <button
                type="button"
                className="editorial-surprise"
                onClick={surprise}
                disabled={loading||improving}
                title="Choose a random cuisine while keeping your dietary needs"
              >
                <Sparkle size={18} weight="duotone" aria-hidden="true" />
                <span>Surprise me</span>
              </button>
            </div>

            <div className="editorial-composer-divider" aria-hidden="true" />

            <div className="editorial-preferences">
              <label className="editorial-pref">
                <GlobeHemisphereWest className="editorial-pref-icon" size={21} weight="duotone" aria-hidden="true" />
                <span className="editorial-pref-label">Cuisine</span>
                <select aria-label="Cuisine preference" value={cuisine} onChange={event=>setCuisine(event.target.value)}>
                  <option>Any Cuisine</option>
                  {Object.entries(CUISINE_GROUPS).map(([region, list])=>(
                    <optgroup key={region} label={region}>
                      {list.map(option=><option key={option}>{option}</option>)}
                    </optgroup>
                  ))}
                </select>
              </label>

              <label className="editorial-pref">
                <Clock className="editorial-pref-icon" size={21} weight="duotone" aria-hidden="true" />
                <span className="editorial-pref-label">Time</span>
                <select aria-label="Cooking time preference" value={time} onChange={event=>setTime(event.target.value)}>
                  {TIMES.map(option=><option key={option}>{option}</option>)}
                </select>
              </label>

              <button
                type="button"
                className="editorial-pref editorial-pref-button"
                onClick={()=>setShowDietPanel(current=>!current)}
                aria-expanded={showDietPanel}
                aria-controls="generator-preferences"
              >
                <SlidersHorizontal className="editorial-pref-icon" size={21} weight="duotone" aria-hidden="true" />
                <span className="editorial-pref-copy">
                  <span className="editorial-pref-label">Diet</span>
                  <span className="editorial-pref-value">{diets.length ? `${diets.length} selected` : "Any"}</span>
                </span>
                <CaretDown
                  size={17}
                  weight="bold"
                  aria-hidden="true"
                  style={{transform:showDietPanel?"rotate(180deg)":"none",transition:"transform 0.2s ease"}}
                />
              </button>
            </div>
          </section>
        </section>

        {showDietPanel && (
          <section id="generator-preferences" className="editorial-options" aria-labelledby="generator-preferences-title">
            <h2 id="generator-preferences-title" className="editorial-options-title">
              <SlidersHorizontal size={22} weight="duotone" aria-hidden="true" />
              Fine-tune your recipe
            </h2>
            <div className="editorial-options-grid">
              <select className="select-field" aria-label="Texture and consistency preference" value={texture} onChange={event=>setTexture(event.target.value)}>
                {TEXTURES.map(option=><option key={option}>{option}</option>)}
              </select>
              <select className="select-field" aria-label="Skill level preference" value={skill} onChange={event=>setSkill(event.target.value)}>
                {SKILLS.map(option=><option key={option}>{option}</option>)}
              </select>
              <select className="select-field" aria-label="Calorie preference" value={calories} onChange={event=>setCalories(event.target.value)}>
                {CALORIE_OPTIONS.map(option=><option key={option}>{option}</option>)}
              </select>
            </div>

            {texture !== "Any Texture" && texture !== "Regular" && (
              <div className="texture-note">{texture} mode keeps the meal varied, complete, and appropriate for the requested texture.</div>
            )}

            <div className="diet-panel">
              {DIET_GROUPS.map(group=>(
                <div key={group.label} className="diet-group">
                  <div className="diet-group-label">{group.label}</div>
                  <div className="improve-chips">
                    {group.options.map(diet=>(
                      <button
                        type="button"
                        key={diet}
                        className={`diet-chip${diets.includes(diet)?" active":""}`}
                        onClick={()=>toggleDiet(diet)}
                        aria-pressed={diets.includes(diet)}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="diet-group">
                <div className="diet-group-label">Anything else?</div>
                <textarea
                  className="ingredient-input diet-custom"
                  aria-label="Custom dietary restrictions and notes"
                  placeholder="Add allergies, texture needs, equipment limits, or other cooking notes."
                  value={customDiet}
                  onChange={event=>setCustomDiet(event.target.value)}
                  maxLength={500}
                  rows={3}
                />
              </div>
              <p className="diet-disclaimer">
                Health and allergy filters guide recipe generation but do not replace medical advice. Verify packaged ingredients and cross-contamination risks.
              </p>
            </div>
          </section>
        )}

        <div className="editorial-footer-art" aria-hidden="true">
          <Image className="editorial-footer-herbs" src="/images/editorial/herb-scatter.webp" alt="" width={420} height={280} />
          <Image className="editorial-footer-linen" src="/images/editorial/linen.webp" alt="" width={520} height={360} />
        </div>

        <div className="editorial-promise">
          <ChefHat size={23} weight="duotone" aria-hidden="true" />
          <span>From your ingredients to a complete recipe—instantly. No more meal-planning guesswork.</span>
        </div>

        {error && <div className="error-message" role="alert" style={{maxWidth:"860px",margin:"0 auto 2rem"}}>{error}</div>}
        {loading && (
          <div className="loading-state generator-results" role="status" aria-live="polite">
            <div className="loading-spinner"/>
            <div>
              <div className="loading-label">Crafting your recipe...</div>
              <div className="loading-sublabel">Our AI is combining flavors, calculating nutrition, and perfecting instructions.</div>
            </div>
          </div>
        )}
        {recipe && !loading && (
          <div className="generator-results">
            <RecipeOutput key={`${recipe.name}-${recipe.servings}`} recipe={recipe} saved={savedIds.has(recipe.name)} onSave={()=>onSave(recipe)} onImprove={improve} onAddToPlanner={(day,meal)=>onAddToPlanner(recipe,day,meal)} onToast={onToast}/>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-eyebrow">AI-Powered Recipe Creation</div>
        <h1 className="hero-title">Turn any ingredients<br/>into <em>extraordinary</em> meals</h1>
        <p className="hero-sub">Tell us what you have. Our AI generates complete, restaurant-quality recipes tailored to your taste, diet, and time.</p>
      </div>
      <div className="gen-card">
        <h2 className="gen-card-title"><span style={{fontSize:"1.4rem"}} aria-hidden="true">◎</span> Your Ingredients</h2>
        <form className="ingredient-input-row" onSubmit={event=>{event.preventDefault();addIngredient();}}>
          <input className="ingredient-input" aria-label="Add an ingredient" placeholder="Add an ingredient (e.g. chicken, garlic…)"
            value={input} onChange={e=>setInput(e.target.value)}
            maxLength={80} autoComplete="off" />
          <button type="submit" className="btn-add">+ Add</button>
        </form>
        <div style={{marginBottom:"0.75rem"}}>
          <span style={{fontSize:"0.65rem",color:"var(--smoke)",marginRight:"0.5rem",fontFamily:"var(--font-mono),monospace",textTransform:"uppercase",letterSpacing:"0.08em"}}>Quick add:</span>
          {QUICK.map(q=>(
            <button type="button" key={q} className="quick-add" aria-pressed={ingredients.includes(q)} onClick={()=>setIngredients(p=>p.includes(q)?p.filter(item=>item!==q):[...p,q])}>
              {q}
            </button>
          ))}
        </div>
        <div className="chip-list">
          {ingredients.length===0 && <span style={{fontSize:"0.82rem",color:"var(--ash)",fontStyle:"italic"}}>No ingredients added yet</span>}
          {ingredients.map(ing=>(
            <span key={ing} className="chip">
              {ing}
              <button type="button" className="chip-x" aria-label={`Remove ${ing}`} onClick={()=>setIngredients(p=>p.filter(i=>i!==ing))}>×</button>
            </span>
          ))}
        </div>
        <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem",marginBottom:"1.25rem"}}>
          <div style={{fontSize:"0.65rem",fontFamily:"var(--font-mono),monospace",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--smoke)",marginBottom:"0.75rem"}}>Preferences</div>
          <div className="filter-row">
            <select className="select-field" aria-label="Cuisine preference" value={cuisine} onChange={e=>setCuisine(e.target.value)}>
              <option>Any Cuisine</option>
              {Object.entries(CUISINE_GROUPS).map(([region, list])=>(
                <optgroup key={region} label={region}>
                  {list.map(c=><option key={c}>{c}</option>)}
                </optgroup>
              ))}
            </select>
            <select className="select-field" aria-label="Texture and consistency preference" value={texture} onChange={e=>setTexture(e.target.value)}>{TEXTURES.map(t=><option key={t}>{t}</option>)}</select>
            <select className="select-field" aria-label="Cooking time preference" value={time} onChange={e=>setTime(e.target.value)}>{TIMES.map(t=><option key={t}>{t}</option>)}</select>
            <select className="select-field" aria-label="Skill level preference" value={skill} onChange={e=>setSkill(e.target.value)}>{SKILLS.map(s=><option key={s}>{s}</option>)}</select>
            <select className="select-field" aria-label="Calorie preference" value={calories} onChange={e=>setCalories(e.target.value)}>{CALORIE_OPTIONS.map(c=><option key={c}>{c}</option>)}</select>
          </div>
          {texture !== "Any Texture" && texture !== "Regular" && (
            <div className="texture-note">
              ✦ {texture} mode: full varied meals, never just soup.
            </div>
          )}
        </div>
        <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem",marginBottom:"1.25rem"}}>
          <button type="button" className="diet-panel-toggle" onClick={()=>setShowDietPanel(p=>!p)} aria-expanded={showDietPanel}>
            <span style={{fontSize:"0.65rem",fontFamily:"var(--font-mono),monospace",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--smoke)"}}>
              Dietary Needs {diets.length > 0 && <span className="nav-badge">{diets.length}</span>}
            </span>
            <span className="diet-panel-arrow">{showDietPanel ? "▴" : "▾"}</span>
          </button>
          {diets.length > 0 && !showDietPanel && (
            <div className="chip-list" style={{marginTop:"0.5rem",marginBottom:0}}>
              {diets.map(d=>(
                <span key={d} className="chip">
                  {d}
                  <button type="button" className="chip-x" aria-label={`Remove ${d}`} onClick={()=>toggleDiet(d)}>×</button>
                </span>
              ))}
            </div>
          )}
          {showDietPanel && (
            <div className="diet-panel">
              {DIET_GROUPS.map(group=>(
                <div key={group.label} className="diet-group">
                  <div className="diet-group-label">{group.icon} {group.label}</div>
                  <div className="improve-chips">
                    {group.options.map(d=>(
                      <button type="button" key={d} className={`diet-chip${diets.includes(d)?" active":""}`} onClick={()=>toggleDiet(d)} aria-pressed={diets.includes(d)}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="diet-group">
                <div className="diet-group-label">✎ Anything else?</div>
                <textarea
                  className="ingredient-input diet-custom"
                  aria-label="Custom dietary restrictions and notes"
                  placeholder="Describe anything that doesn't fit above, such as post-surgery recovery, chewing difficulty, no raw onions, bariatric portions, microwave-only cooking, or kid-friendly textures."
                  value={customDiet}
                  onChange={e=>setCustomDiet(e.target.value)}
                  maxLength={500}
                  rows={3}
                />
              </div>
              <p className="diet-disclaimer">
                Health and allergy filters guide recipe generation but do not replace medical advice. Verify packaged ingredients and cross-contamination risks.
              </p>
            </div>
          )}
        </div>
        <div className="generate-row">
          <button type="button" className="btn-generate" onClick={generate} disabled={loading||improving}>
            {loading||improving ? <><div className="shimmer"/><span>{loading?"Generating your recipe…":"Improving recipe…"}</span></> : <><span style={{fontSize:"1.3rem"}}>✦</span><span>Generate Recipe with AI</span></>}
          </button>
          <button type="button" className="btn-surprise" onClick={surprise} disabled={loading||improving} title="Random cuisine, your dietary needs still respected">
            🎲 Surprise Me
          </button>
        </div>
        {error && <div className="error-message" role="alert">{error}</div>}
      </div>
      {loading && (
        <div className="loading-state" role="status" aria-live="polite">
          <div className="loading-spinner"/>
          <div>
            <div className="loading-label">Crafting your recipe…</div>
            <div className="loading-sublabel">Our AI is combining flavors, calculating nutrition, and perfecting instructions.</div>
          </div>
        </div>
      )}
      {recipe && !loading && (
        <RecipeOutput key={`${recipe.name}-${recipe.servings}`} recipe={recipe} saved={savedIds.has(recipe.name)} onSave={()=>onSave(recipe)} onImprove={improve} onAddToPlanner={(day,meal)=>onAddToPlanner(recipe,day,meal)} onToast={onToast}/>
      )}
    </div>
  );
}

// ─── DiscoverPage ─────────────────────────────────────────────────────────────
type SampleRecipe = typeof SAMPLE_RECIPES[0];

type AmbientVariant = "discover" | "pantry" | "planner" | "saved";

const AMBIENT_ASSETS: Record<AmbientVariant, { primary: string; secondary: string }> = {
  discover: {
    primary: "/images/editorial/tomato.webp",
    secondary: "/images/editorial/basil.webp",
  },
  pantry: {
    primary: "/images/editorial/garlic.webp",
    secondary: "/images/editorial/herb-scatter.webp",
  },
  planner: {
    primary: "/images/editorial/lemon.webp",
    secondary: "/images/editorial/basil.webp",
  },
  saved: {
    primary: "/images/editorial/basil.webp",
    secondary: "/images/editorial/tomato.webp",
  },
};

function AmbientPageBackground({ variant }: { variant: AmbientVariant }) {
  const root = useRef<HTMLDivElement>(null);
  const assets = AMBIENT_ASSETS[variant];

  useEffect(() => {
    if (!root.current) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let scope: ReturnType<typeof createScope> | null = null;

    if (!reduceMotion) {
      scope = createScope({ root }).add(() => {
        animate(".ambient-float", {
          x: stagger([-14, 14]),
          y: stagger([10, -12], { from: "center" }),
          rotate: stagger([-4, 4]),
          duration: 8800,
          delay: stagger(420),
          ease: "inOut(2)",
          alternate: true,
          loop: true,
        });

        animate(".ambient-halo", {
          scale: stagger([0.96, 1.045]),
          duration: 9600,
          delay: stagger(900),
          ease: "inOut(2)",
          alternate: true,
          loop: true,
        });

        animate(".ambient-dots", {
          x: 16,
          y: -9,
          duration: 7200,
          ease: "inOut(2)",
          alternate: true,
          loop: true,
        });
      });
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const x = ((event.clientX / window.innerWidth) - 0.5) * 16;
        const y = ((event.clientY / window.innerHeight) - 0.5) * 12;
        root.current?.style.setProperty("--pointer-x", `${x.toFixed(2)}px`);
        root.current?.style.setProperty("--pointer-y", `${y.toFixed(2)}px`);
      });
    };

    if (!reduceMotion) window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", handlePointerMove);
      scope?.revert();
    };
  }, [variant]);

  return (
    <div ref={root} className={`page-ambience page-ambience-${variant}`} aria-hidden="true">
      <div className="ambient-wash" />
      <span className="ambient-halo ambient-halo-one" />
      <span className="ambient-halo ambient-halo-two" />
      <span className="ambient-dots" />
      <div className="ambient-pointer-layer">
        <Image
          className="ambient-ingredient ambient-ingredient-primary ambient-float"
          src={assets.primary}
          alt=""
          width={540}
          height={540}
          sizes="(max-width: 640px) 180px, 24vw"
        />
        <Image
          className="ambient-ingredient ambient-ingredient-secondary ambient-float"
          src={assets.secondary}
          alt=""
          width={520}
          height={420}
          sizes="(max-width: 640px) 180px, 22vw"
        />
        <Image
          className="ambient-linen ambient-float"
          src="/images/editorial/linen.webp"
          alt=""
          width={720}
          height={480}
          sizes="(max-width: 640px) 360px, 42vw"
        />
      </div>
    </div>
  );
}

function DiscoverPage({ onSave, savedIds, onAddToPlanner, onToast }: {
  onSave:(r:Recipe)=>void; savedIds:Set<string>;
  onAddToPlanner: (recipe: Recipe, day: string, meal: MealKey) => void;
  onToast: (msg: string, icon?: string) => void;
}) {
  const [filter, setFilter] = useState("All");
  const [dietFilter, setDietFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("All");
  const [diffFilter, setDiffFilter] = useState("All");
  const [activeCard, setActiveCard] = useState<SampleRecipe|null>(null);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe|null>(null);
  const [loading, setLoading] = useState(false);
  const [improving, setImproving] = useState(false);
  const [error, setError] = useState<string|null>(null);
  const lastFocusedRef = useRef<HTMLElement|null>(null);

  const filters = ["All", ...Array.from(new Set(SAMPLE_RECIPES.map(r=>r.cuisine)))];
  const dietFilters = ["All", ...Array.from(new Set(SAMPLE_RECIPES.flatMap(r=>r.tags))).sort()];
  const TIME_FILTERS: Array<[string, (m:number)=>boolean]> = [
    ["All", ()=>true],
    ["≤ 30 min", m=>m<=30],
    ["≤ 1 hr", m=>m<=60],
    ["Slow & worth it", m=>m>60],
  ];
  const DIFF_FILTERS = ["All","Easy","Intermediate","Advanced"];

  const timeFn = TIME_FILTERS.find(([label])=>label===timeFilter)?.[1] ?? (()=>true);
  const shown = SAMPLE_RECIPES.filter(r=>
    (filter==="All" || r.cuisine===filter) &&
    (dietFilter==="All" || r.tags.includes(dietFilter)) &&
    timeFn(r.mins) &&
    (diffFilter==="All" || r.diff===diffFilter)
  );

  useEffect(() => {
    if (!activeCard) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCard(null);
        setGeneratedRecipe(null);
        setError(null);
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => {
      window.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = previousOverflow;
      lastFocusedRef.current?.focus();
    };
  }, [activeCard]);

  const openCard = async (card: SampleRecipe) => {
    if (!activeCard) {
      lastFocusedRef.current = document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    }
    setActiveCard(card);
    setGeneratedRecipe(null);
    setError(null);
    setLoading(true);
    try {
      const result = await callClaude(buildDiscoverPrompt(card));
      setGeneratedRecipe(result);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "Unknown error";
      setError(`Failed to generate recipe: ${msg}`);
    }
    finally { setLoading(false); }
  };

  const closeModal = () => { setActiveCard(null); setGeneratedRecipe(null); setError(null); };

  const improve = async (instruction: string) => {
    if (!generatedRecipe || improving) return;
    setImproving(true);
    try {
      const result = await callClaude(buildImprovePrompt(generatedRecipe, instruction));
      setGeneratedRecipe(result);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "Unknown error";
      setError(`Improvement failed: ${msg}`);
    }
    finally { setImproving(false); }
  };

  return (
    <div className="page ambient-page">
      <AmbientPageBackground variant="discover" />
      <div className="discover-page page-content-layer">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Recipe Collection</div>
          <h1 className="discover-title">Discover <em style={{fontFamily:"var(--font-display),Georgia,serif",fontStyle:"italic",color:"var(--terra)"}}>exceptional</em> dishes</h1>
          <p style={{color:"var(--smoke)",fontSize:"0.9rem"}}>Open any dish to get the full AI-generated recipe with ingredients, steps, and nutrition.</p>
        </div>
        <div className="filter-bar">
          <span className="filter-label">Cuisine:</span>
          {filters.map(f=><button type="button" key={f} className={`filter-chip${filter===f?" active":""}`} aria-pressed={filter===f} onClick={()=>setFilter(f)}>{f}</button>)}
        </div>
        <div className="filter-bar">
          <span className="filter-label">Diet:</span>
          {dietFilters.map(f=><button type="button" key={f} className={`filter-chip${dietFilter===f?" active":""}`} aria-pressed={dietFilter===f} onClick={()=>setDietFilter(f)}>{f}</button>)}
        </div>
        <div className="filter-bar">
          <span className="filter-label">Time:</span>
          {TIME_FILTERS.map(([label])=><button type="button" key={label} className={`filter-chip${timeFilter===label?" active":""}`} aria-pressed={timeFilter===label} onClick={()=>setTimeFilter(label)}>{label}</button>)}
          <span className="filter-label" style={{marginLeft:"0.75rem"}}>Skill:</span>
          {DIFF_FILTERS.map(f=><button type="button" key={f} className={`filter-chip${diffFilter===f?" active":""}`} aria-pressed={diffFilter===f} onClick={()=>setDiffFilter(f)}>{f}</button>)}
          {(filter!=="All"||dietFilter!=="All"||timeFilter!=="All"||diffFilter!=="All") && (
            <button type="button" className="filter-chip" style={{marginLeft:"auto",color:"var(--terra)",borderColor:"var(--terra)"}}
              onClick={()=>{setFilter("All");setDietFilter("All");setTimeFilter("All");setDiffFilter("All");}}>
              ✕ Clear ({shown.length} shown)
            </button>
          )}
        </div>
        {shown.length===0 && (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <div className="empty-text">No recipes match those filters</div>
            <p style={{fontSize:"0.9rem",color:"var(--smoke)",marginTop:"0.5rem"}}>Try clearing a filter, or use Generate to create exactly what you need.</p>
          </div>
        )}
        <div className="recipe-grid">
          {shown.map(r=>(
            <button key={r.id} type="button" className="recipe-card" onClick={()=>openCard(r)}>
              <div className="recipe-card-img">
                <span style={{position:"relative",zIndex:1}}>{r.emoji}</span>
                <div className="recipe-card-img-overlay"/>
                <span className="recipe-card-tag">{r.cuisine}</span>
              </div>
              <div className="recipe-card-body">
                <div className="recipe-card-name">{r.name}</div>
                <div className="recipe-card-meta">
                  <span>⏱ {r.time}</span>
                  <span>🔥 {r.calories} cal</span>
                  <span className="recipe-card-rating">★ {r.rating}</span>
                </div>
                {r.tags.length > 0 && (
                  <div className="recipe-card-tags">
                    {r.tags.slice(0,3).map(t=><span key={t} className="recipe-card-diet-tag">{t}</span>)}
                  </div>
                )}
                <div className="recipe-card-hint">✦ View full recipe →</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {activeCard && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-inner" role="dialog" aria-modal="true" aria-label={activeCard.name} onKeyDown={trapDialogFocus} onClick={e=>e.stopPropagation()}>
            <button type="button" className="modal-close" aria-label="Close recipe dialog" autoFocus onClick={closeModal}>✕</button>

            {loading && (
              <div className="modal-loading-card">
                <div className="loading-state" role="status" aria-live="polite">
                  <div className="loading-spinner"/>
                  <div>
                    <div className="loading-label">Crafting {activeCard.name}…</div>
                    <div className="loading-sublabel">Generating full recipe with ingredients, steps, and nutrition.</div>
                  </div>
                </div>
              </div>
            )}

            {error && !loading && (
              <div className="modal-error-card">
                <p role="alert" style={{color:"var(--error)",marginBottom:"1rem"}}>{error}</p>
                <button type="button" className="btn-add" onClick={()=>openCard(activeCard)}>Try Again</button>
              </div>
            )}

            {generatedRecipe && !loading && (
              <div style={{position:"relative"}}>
                {improving && (
                  <div className="improve-overlay">
                    <div className="loading-spinner"/>
                    <div className="loading-label" style={{fontSize:"1rem"}}>Improving recipe…</div>
                  </div>
                )}
                <RecipeOutput
                  key={`${generatedRecipe.name}-${generatedRecipe.servings}`}
                  recipe={generatedRecipe}
                  saved={savedIds.has(generatedRecipe.name)}
                  onSave={()=>onSave(generatedRecipe)}
                  onImprove={improve}
                  onAddToPlanner={(day,meal)=>onAddToPlanner(generatedRecipe,day,meal)}
                  onToast={onToast}
                />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PantryPage ───────────────────────────────────────────────────────────────
function PantryPage({ items, setItems, onGenerateFromPantry }: {
  items: PantryItem[];
  setItems: React.Dispatch<React.SetStateAction<PantryItem[]>>;
  onGenerateFromPantry: () => void;
}) {
  const [newItem, setNewItem] = useState("");
  const [editingIdx, setEditingIdx] = useState<number|null>(null);
  const [editName, setEditName] = useState("");
  const [editQty, setEditQty] = useState("");
  const [editStatus, setEditStatus] = useState<PantryStatus>("ok");

  const add = () => {
    if (newItem.trim()) { setItems(p=>[...p,{name:newItem.trim(),qty:"1 unit",status:"ok"}]); setNewItem(""); }
  };
  const startEdit = (i: number) => {
    setEditingIdx(i); setEditName(items[i].name); setEditQty(items[i].qty); setEditStatus(items[i].status);
  };
  const saveEdit = () => {
    if (editingIdx===null || !editName.trim()) return;
    setItems(p=>p.map((item,i)=>i===editingIdx?{
      name:editName.trim(),
      qty:editQty.trim() || "1 unit",
      status:editStatus
    }:item));
    setEditingIdx(null);
  };

  return (
    <div className="page ambient-page">
      <AmbientPageBackground variant="pantry" />
      <div className="pantry-page page-content-layer">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Smart Pantry</div>
          <h1 className="discover-title">Your <em style={{fontFamily:"var(--font-display),Georgia,serif",fontStyle:"italic",color:"var(--terra)"}}>pantry</em></h1>
        </div>
        <form style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}} onSubmit={event=>{event.preventDefault();add();}}>
          <input className="ingredient-input" aria-label="Add ingredient to pantry" placeholder="Add ingredient to pantry…" value={newItem} maxLength={80} autoComplete="off" onChange={e=>setNewItem(e.target.value)}/>
          <button type="submit" className="btn-add">+ Add</button>
        </form>
        <div className="pantry-grid">
          <div className="pantry-card">
            <h2 className="pantry-card-title">◎ Current Stock</h2>
            {items.length===0 && (
              <p style={{fontSize:"0.85rem",color:"var(--smoke)",padding:"0.75rem 0 1rem"}}>
                Your pantry is empty. Add an ingredient above to get started.
              </p>
            )}
            {items.map((item,i)=>(
              <div key={i} className="pantry-item">
                {editingIdx===i ? (
                  <div className="pantry-item-edit">
                    <input className="ingredient-input" aria-label="Ingredient name" style={{padding:"0.35rem 0.5rem",fontSize:"0.82rem"}} value={editName} maxLength={80} onChange={e=>setEditName(e.target.value)} onKeyDown={event=>{if(event.key==="Enter")saveEdit();if(event.key==="Escape")setEditingIdx(null);}}/>
                    <div className="pantry-item-controls">
                      <input className="ingredient-input" aria-label="Ingredient quantity" style={{padding:"0.35rem 0.5rem",fontSize:"0.82rem",width:"90px"}} value={editQty} maxLength={40} onChange={e=>setEditQty(e.target.value)} placeholder="qty"/>
                      <button type="button" className={`pantry-status-toggle ${editStatus}`} aria-label={`Stock status: ${editStatus==="ok"?"in stock":"low"}. Change status.`} onClick={()=>setEditStatus(s=>s==="ok"?"low":"ok")}>
                        {editStatus==="ok"?"In Stock":"Low"}
                      </button>
                      <button type="button" className="pantry-edit-save" disabled={!editName.trim()} onClick={saveEdit}>✓ Save</button>
                      <button type="button" className="pantry-edit-cancel" onClick={()=>setEditingIdx(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="pantry-item-name">
                      <span className={`pantry-item-dot${item.status==="low"?" low":""}`} aria-hidden="true"/>
                      {item.name}
                      <span className="sr-only">, {item.status==="low"?"low stock":"in stock"}</span>
                    </div>
                    <div className="pantry-item-actions">
                      <span style={{fontSize:"0.78rem",color:"var(--smoke)",fontFamily:"var(--font-mono),monospace"}}>{item.qty}</span>
                      <button type="button" className="pantry-icon-btn edit" aria-label={`Edit ${item.name}`} onClick={()=>startEdit(i)}>✎</button>
                      <button type="button" className="pantry-icon-btn delete" aria-label={`Remove ${item.name}`} onClick={()=>setItems(p=>p.filter((_,j)=>j!==i))}>×</button>
                    </div>
                  </>
                )}
              </div>
            ))}
            <button type="button" className="pantry-suggest-btn" disabled={items.length===0} onClick={onGenerateFromPantry}>✦ Generate Recipe from Pantry</button>
          </div>
          <div>
            <div className="pantry-card" style={{marginBottom:"1rem"}}>
              <h2 className="pantry-card-title">🛒 Shopping Suggestions</h2>
              {items.filter(i=>i.status==="low").length===0 ? (
                <p style={{fontSize:"0.82rem",color:"var(--smoke)",fontStyle:"italic",padding:"0.4rem 0"}}>Nothing is running low. Your pantry is fully stocked. ✓</p>
              ) : items.filter(i=>i.status==="low").map(item=>(
                <div key={item.name} className="pantry-item">
                  <div className="pantry-item-name"><span className="pantry-item-dot low" aria-hidden="true"/>{item.name}</div>
                  <span style={{fontSize:"0.75rem",color:"var(--terra)"}}>Running low ({item.qty} left)</span>
                </div>
              ))}
            </div>
            <div className="pantry-card">
              <h2 className="pantry-card-title">◈ Recipe Suggestions</h2>
              {["Aglio e Olio","Chicken Piccata","Frittata","Lemon Pasta"].map(r=>(
                <div key={r} style={{padding:"0.4rem 0",fontSize:"0.88rem",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{r}</span>
                  <span style={{fontSize:"0.75rem",color:"var(--sage)",fontFamily:"var(--font-mono),monospace"}}>pantry-friendly</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PlannerPage ──────────────────────────────────────────────────────────────
function PlannerPage({ mealPlan, onRegenerate }: { mealPlan: MealPlan; onRegenerate: () => void }) {
  const days = Object.keys(mealPlan);
  return (
    <div className="page ambient-page">
      <AmbientPageBackground variant="planner" />
      <div className="planner-page page-content-layer">
        <div style={{marginBottom:"1.5rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>AI Meal Planner</div>
          <h1 className="discover-title">Weekly <em style={{fontFamily:"var(--font-display),Georgia,serif",fontStyle:"italic",color:"var(--terra)"}}>meal plan</em></h1>
        </div>
        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
          {[["Target","1800 kcal/day"],["Protein","120g"],["Carbs","200g"],["Fat","65g"]].map(([label,val])=>(
            <div key={label} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"12px",padding:"0.75rem 1.25rem",textAlign:"center"}}>
              <div style={{fontFamily:"var(--font-mono),monospace",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--smoke)",marginBottom:"0.2rem"}}>{label}</div>
              <div style={{fontFamily:"var(--font-display),Georgia,serif",fontSize:"1.3rem",fontWeight:600,color:"var(--bark)"}}>{val}</div>
            </div>
          ))}
          <button type="button" onClick={onRegenerate} style={{minHeight:"44px",padding:"0.75rem 1.25rem",borderRadius:"12px",background:"var(--terra)",color:"var(--on-accent)",border:"none",cursor:"pointer",fontFamily:"var(--font-body),system-ui,sans-serif",fontSize:"0.9rem",fontWeight:500,marginLeft:"auto"}}>✦ Regenerate Plan</button>
        </div>
        <div className="planner-grid">
          {days.map(day=>(
            <div key={day} className="planner-day">
              <div className="planner-day-name">{day}</div>
              {(["b","l","d"] as const).map((key,i)=>(
                <div key={key} className="planner-meal">
                  <div className="planner-meal-type">{["Breakfast","Lunch","Dinner"][i]}</div>
                  <div className="planner-meal-name">{mealPlan[day][key]}</div>
                </div>
              ))}
              <div className="planner-cal">{mealPlan[day].cal} kcal</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SavedPage ────────────────────────────────────────────────────────────────
function SavedPage({ saved, onRemove }: { saved:Recipe[]; onRemove:(r:Recipe)=>void }) {
  return (
    <div className="page ambient-page">
      <AmbientPageBackground variant="saved" />
      <div className="saved-page page-content-layer">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Your Collection</div>
          <h1 className="discover-title">Saved <em style={{fontFamily:"var(--font-display),Georgia,serif",fontStyle:"italic",color:"var(--terra)"}}>recipes</em></h1>
        </div>
        {saved.length===0 ? (
          <div className="empty-state">
            <div className="empty-icon">♡</div>
            <div className="empty-text">No saved recipes yet</div>
            <p style={{fontSize:"0.9rem",color:"var(--smoke)",marginTop:"0.5rem"}}>Generate or discover recipes, then save your favorites here.</p>
          </div>
        ) : (
          <div className="recipe-grid">
            {saved.map((r,i)=>(
              <article key={i} className="recipe-card saved-card">
                <div className="recipe-card-img">
                  <span style={{position:"relative",zIndex:1,fontSize:"3rem"}}>{r.emoji||"🍽️"}</span>
                  <div className="recipe-card-img-overlay"/>
                  <span className="recipe-card-tag">{r.cuisine||"Custom"}</span>
                </div>
                <div className="recipe-card-body">
                  <div className="recipe-card-name">{r.name}</div>
                  <div className="recipe-card-meta">
                    <span>⏱ {r.time||"Not set"}</span>
                    <span>🔥 {r.nutrition?.calories||r.calories||"Not set"} cal</span>
                  </div>
                  <button type="button" className="btn-action" style={{marginTop:"0.75rem",width:"100%",justifyContent:"center",background:"var(--warm-white)"}} onClick={()=>onRemove(r)}>
                    Remove
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function RecipePlatform() {
  const [tab, setTab] = useState("generate");
  const [storedTheme, setTheme] = usePersistentState<ThemeMode>(STORAGE_KEYS.theme, "light");
  const [saved, setSaved] = usePersistentState<Recipe[]>(STORAGE_KEYS.saved, EMPTY_RECIPES);
  const [toasts, setToasts] = useState<Array<{id:number;msg:string;icon:string}>>([]);
  const [pantryItems, setPantryItems] = usePersistentState<PantryItem[]>(STORAGE_KEYS.pantry, PANTRY_ITEMS);
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = usePersistentState<MealPlan>(STORAGE_KEYS.mealPlan, MEAL_PLAN);
  const toastRef = useRef(0);
  const theme: ThemeMode = storedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  }, [theme]);

  const addToast = (msg: string, icon = "✓") => {
    const id = ++toastRef.current;
    setToasts(p=>[...p,{id,msg,icon}]);
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)), 3000);
  };

  const handleSave = (recipe: Recipe) => {
    if (saved.find(r=>r.name===recipe.name)) {
      setSaved(p=>p.filter(r=>r.name!==recipe.name));
      addToast("Recipe removed","✕");
    } else {
      setSaved(p=>[...p,recipe]);
      addToast("Recipe saved!","♡");
    }
  };

  const handleAddToPlanner = (recipe: Recipe, day: string, meal: MealKey) => {
    setMealPlan(p=>({...p, [day]:{...p[day],[meal]:recipe.name}}));
    const label = meal==="b"?"Breakfast":meal==="l"?"Lunch":"Dinner";
    addToast(`Added to ${day} ${label}`, "📅");
  };

  const handleRegeneratePlan = () => {
    setMealPlan(buildMealPlan(saved));
    addToast("Meal plan regenerated", "✦");
  };

  const savedIds = new Set(saved.map(r=>r.name));

  return (
    <>
<div className="app">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <nav className="nav" aria-label="Primary">
          <div className="nav-logo">
            <Diamond className="nav-logo-mark" size={19} weight="duotone" aria-hidden="true" />
            <span>Culinaria</span>
          </div>
          <div className="nav-actions">
            <div className="nav-tabs">
              {[{id:"generate",label:"Generate"},{id:"discover",label:"Discover"},{id:"pantry",label:"Pantry"},{id:"planner",label:"Planner"},{id:"saved",label:"Saved",badge:saved.length||null}].map(t=>(
                <button type="button" key={t.id} aria-current={tab===t.id?"page":undefined} className={`nav-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                  {t.label}{t.badge?<span className="nav-badge">{t.badge}</span>:null}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="theme-toggle"
              aria-label="Night mode"
              aria-pressed={theme === "dark"}
              title={theme === "dark" ? "Switch to day mode" : "Switch to night mode"}
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark"
                ? <Sun size={19} weight="duotone" aria-hidden="true" />
                : <MoonStars size={19} weight="duotone" aria-hidden="true" />}
            </button>
          </div>
        </nav>
        <main id="main-content" tabIndex={-1}>
          {tab==="generate" && <GeneratorPage onSave={handleSave} savedIds={savedIds} initialIngredients={pendingIngredients} onAddToPlanner={handleAddToPlanner} onToast={addToast}/>}
          {tab==="discover" && <DiscoverPage onSave={handleSave} savedIds={savedIds} onAddToPlanner={handleAddToPlanner} onToast={addToast}/>}
          {tab==="pantry" && <PantryPage items={pantryItems} setItems={setPantryItems} onGenerateFromPantry={()=>{setPendingIngredients(pantryItems.map(i=>i.name));setTab("generate");}}/>}
          {tab==="planner" && <PlannerPage mealPlan={mealPlan} onRegenerate={handleRegeneratePlan}/>}
          {tab==="saved" && <SavedPage saved={saved} onRemove={handleSave}/>}
        </main>
        <FeedbackWidget currentView={tab} />
        <Toast toasts={toasts}/>
      </div>
    </>
  );
}
