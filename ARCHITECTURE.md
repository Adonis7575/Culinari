# Culina — AI Recipe Platform: Full System Architecture

## Overview

Culina is a full-stack AI-powered recipe creation and discovery platform. This document covers the complete system design, database schema, API integrations, AI prompt pipeline, and deployment instructions.

---

## System Architecture

```
┌──────────────────────────────────────────────────────┐
│                    CLIENT (Next.js)                   │
│  Generator | Discover | Pantry | Planner | Saved     │
└──────────────────────┬───────────────────────────────┘
                       │ HTTPS
┌──────────────────────▼───────────────────────────────┐
│               API GATEWAY (Kong / Nginx)              │
│          Rate limiting · Auth · Routing               │
└────┬──────────┬──────────┬──────────┬────────────────┘
     │          │          │          │
┌────▼──┐  ┌───▼───┐  ┌───▼───┐  ┌───▼───────────────┐
│Recipe │  │ User  │  │ Nutri │  │ Recommendation    │
│Engine │  │Service│  │Engine │  │ Engine            │
│(Node) │  │(Node) │  │(Fast) │  │ (Python/FastAPI)  │
└────┬──┘  └───┬───┘  └───┬───┘  └───┬───────────────┘
     │          │          │          │
┌────▼──────────▼──────────▼──────────▼────────────────┐
│                    Data Layer                         │
│  PostgreSQL · Redis · Pinecone (vector) · S3          │
└──────────────────────────────────────────────────────┘
     │
┌────▼──────────────────────────────────────────────────┐
│               External Integrations                   │
│  Anthropic API · Spoonacular · Edamam · TheMealDB     │
│  USDA FoodData · Stripe (optional)                    │
└───────────────────────────────────────────────────────┘
```

---

## Database Schema (PostgreSQL)

```sql
-- Users
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  name        TEXT,
  avatar_url  TEXT,
  preferences JSONB DEFAULT '{}',
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Recipes
CREATE TABLE recipes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES users(id),
  name         TEXT NOT NULL,
  cuisine      TEXT,
  description  TEXT,
  time_minutes INT,
  difficulty   TEXT CHECK (difficulty IN ('Easy','Intermediate','Advanced')),
  servings     INT DEFAULT 2,
  source       TEXT DEFAULT 'ai',        -- 'ai' | 'spoonacular' | 'edamam' | 'user'
  external_id  TEXT,
  is_public    BOOLEAN DEFAULT true,
  embedding    VECTOR(1536),             -- pgvector for similarity
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- Ingredients
CREATE TABLE ingredients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name         TEXT UNIQUE NOT NULL,
  usda_id      TEXT,
  category     TEXT,
  embedding    VECTOR(1536)
);

-- Recipe Ingredients (join)
CREATE TABLE recipe_ingredients (
  recipe_id     UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id),
  amount        TEXT,
  unit          TEXT,
  notes         TEXT,
  PRIMARY KEY (recipe_id, ingredient_id)
);

-- Instructions
CREATE TABLE recipe_steps (
  id        SERIAL PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  step_num  INT NOT NULL,
  content   TEXT NOT NULL
);

-- Nutrition
CREATE TABLE nutrition (
  recipe_id  UUID PRIMARY KEY REFERENCES recipes(id) ON DELETE CASCADE,
  calories   NUMERIC,
  protein_g  NUMERIC,
  carbs_g    NUMERIC,
  fat_g      NUMERIC,
  fiber_g    NUMERIC,
  sugar_g    NUMERIC,
  sodium_mg  NUMERIC,
  data_source TEXT DEFAULT 'ai_estimated'
);

-- Pantry
CREATE TABLE pantry_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id),
  quantity      TEXT,
  expires_at    DATE,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- Favorites / Saves
CREATE TABLE saved_recipes (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,
  saved_at   TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Ratings
CREATE TABLE ratings (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  recipe_id  UUID REFERENCES recipes(id) ON DELETE CASCADE,
  score      SMALLINT CHECK (score BETWEEN 1 AND 5),
  review     TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, recipe_id)
);

-- Meal Plans
CREATE TABLE meal_plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start DATE NOT NULL,
  plan_data  JSONB NOT NULL,   -- {mon:{b,l,d}, tue:...}
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Ingredient Relationships (Knowledge Graph)
CREATE TABLE ingredient_relations (
  ingredient_a UUID REFERENCES ingredients(id),
  ingredient_b UUID REFERENCES ingredients(id),
  relation_type TEXT,   -- 'pairs_well', 'substitutes', 'same_cuisine'
  strength      NUMERIC DEFAULT 0.5,
  PRIMARY KEY (ingredient_a, ingredient_b, relation_type)
);
```

---

## Backend Services

### 1. Recipe Engine (Node.js/Express)

```javascript
// routes/recipes.js
import express from 'express';
import { generateRecipe, improveRecipe } from '../services/ai.js';
import { fetchNutrition } from '../services/nutrition.js';
import { db } from '../db/index.js';

const router = express.Router();

// POST /api/recipes/generate
router.post('/generate', async (req, res) => {
  const { ingredients, cuisine, diet, time, skill, calories, userId } = req.body;

  // Check cache first
  const cacheKey = `recipe:${JSON.stringify({ ingredients: ingredients.sort(), cuisine, diet })}`;
  const cached = await redis.get(cacheKey);
  if (cached) return res.json(JSON.parse(cached));

  // Generate via AI
  const recipe = await generateRecipe({ ingredients, cuisine, diet, time, skill, calories });

  // Enrich with nutrition
  const nutrition = await fetchNutrition(recipe.ingredients);
  recipe.nutrition = nutrition;

  // Store in DB
  const saved = await db.recipes.create({ ...recipe, userId, source: 'ai' });

  // Cache for 24h
  await redis.setex(cacheKey, 86400, JSON.stringify(saved));

  res.json(saved);
});

// POST /api/recipes/:id/improve
router.post('/:id/improve', async (req, res) => {
  const { instruction } = req.body;
  const recipe = await db.recipes.findById(req.params.id);
  const improved = await improveRecipe(recipe, instruction);
  res.json(improved);
});

// GET /api/recipes/discover
router.get('/discover', async (req, res) => {
  const { cuisine, diet, maxTime, maxCalories, page = 0 } = req.query;
  const recipes = await db.recipes.findAll({
    cuisine, diet, maxTime, maxCalories,
    limit: 24, offset: page * 24,
    orderBy: 'rating DESC'
  });
  res.json(recipes);
});

export default router;
```

### 2. AI Service

```javascript
// services/ai.js
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function generateRecipe(params) {
  const { ingredients, cuisine, diet, time, skill, calories } = params;

  const prompt = `You are a world-class chef AI. Generate a complete recipe.

Ingredients available: ${ingredients.join(', ')}
Cuisine preference: ${cuisine || 'any'}
Dietary restriction: ${diet || 'none'}
Time available: ${time || 'flexible'}
Skill level: ${skill || 'intermediate'}
Calorie target: ${calories || 'flexible'}

Respond ONLY with valid JSON:
{
  "name": "...",
  "cuisine": "...",
  "description": "...",
  "time": "...",
  "difficulty": "Easy|Intermediate|Advanced",
  "servings": 2,
  "ingredients": [{"amount": "...", "name": "..."}],
  "steps": ["..."],
  "nutrition": {"calories": 0, "protein": 0, "carbs": 0, "fat": 0},
  "tips": "..."
}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}

export async function improveRecipe(recipe, instruction) {
  const prompt = `Modify this recipe per the instruction.
Recipe: ${JSON.stringify(recipe)}
Instruction: "${instruction}"
Return ONLY the modified recipe as valid JSON in the same schema.`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}

export async function generateMealPlan(userId, preferences) {
  const { calories, protein, days = 7 } = preferences;
  
  const prompt = `Create a ${days}-day meal plan.
Daily calorie target: ${calories}
Protein target: ${protein}g
Return JSON: {mon:{b:"...",l:"...",d:"..."},tue:...}`;

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  });

  return JSON.parse(response.content[0].text);
}
```

### 3. External API Integration

```javascript
// services/externalRecipes.js

// Spoonacular
export async function searchSpoonacular(query, filters = {}) {
  const params = new URLSearchParams({
    apiKey: process.env.SPOONACULAR_KEY,
    query,
    diet: filters.diet || '',
    cuisine: filters.cuisine || '',
    maxReadyTime: filters.maxTime || 120,
    number: 12,
    addRecipeNutrition: true,
  });
  const res = await fetch(`https://api.spoonacular.com/recipes/complexSearch?${params}`);
  const data = await res.json();
  return normalizeSpoonacular(data.results);
}

// Edamam
export async function searchEdamam(query, filters = {}) {
  const params = new URLSearchParams({
    app_id: process.env.EDAMAM_APP_ID,
    app_key: process.env.EDAMAM_KEY,
    q: query,
    diet: filters.diet || '',
    cuisineType: filters.cuisine || '',
  });
  const res = await fetch(`https://api.edamam.com/search?${params}`);
  const data = await res.json();
  return normalizeEdamam(data.hits);
}

// Normalize to internal schema
function normalizeSpoonacular(recipes) {
  return recipes.map(r => ({
    name: r.title,
    cuisine: r.cuisines?.[0] || 'International',
    time: `${r.readyInMinutes} min`,
    servings: r.servings,
    image: r.image,
    source: 'spoonacular',
    externalId: String(r.id),
    nutrition: {
      calories: r.nutrition?.nutrients?.find(n=>n.name==='Calories')?.amount || 0,
      protein: r.nutrition?.nutrients?.find(n=>n.name==='Protein')?.amount || 0,
      carbs: r.nutrition?.nutrients?.find(n=>n.name==='Carbohydrates')?.amount || 0,
      fat: r.nutrition?.nutrients?.find(n=>n.name==='Fat')?.amount || 0,
    }
  }));
}
```

### 4. Recommendation Engine (Python/FastAPI)

```python
# recommendation/main.py
from fastapi import FastAPI
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import psycopg2
from openai import OpenAI

app = FastAPI()

@app.get("/recommend/{user_id}")
async def recommend_recipes(user_id: str, n: int = 10):
    """Hybrid collaborative + content-based filtering."""
    
    # 1. Get user's saved/rated recipes
    user_recipes = get_user_recipes(user_id)
    
    # 2. Get user embedding (avg of their recipe embeddings)
    user_embedding = get_user_embedding(user_recipes)
    
    # 3. Find similar recipes via vector similarity (Pinecone)
    similar = pinecone_index.query(
        vector=user_embedding.tolist(),
        top_k=n * 3,
        filter={"source": {"$ne": "already_seen"}}
    )
    
    # 4. Re-rank by collaborative signal (others with similar taste)
    reranked = collaborative_rerank(user_id, similar.matches)
    
    return {"recommendations": reranked[:n]}

@app.get("/similar/{recipe_id}")
async def similar_recipes(recipe_id: str, n: int = 6):
    """Find recipes similar to given recipe."""
    recipe = get_recipe_embedding(recipe_id)
    results = pinecone_index.query(vector=recipe, top_k=n+1)
    return {"similar": [r for r in results.matches if r.id != recipe_id][:n]}

@app.get("/pantry-match/{user_id}")
async def pantry_match(user_id: str):
    """Match user pantry to available recipes."""
    pantry = get_user_pantry(user_id)
    ingredient_ids = [item.ingredient_id for item in pantry]
    
    # Find recipes where >80% of ingredients are in pantry
    matches = db.query("""
        SELECT r.*, 
               COUNT(ri.ingredient_id) FILTER (WHERE ri.ingredient_id = ANY(%s)) as matches,
               COUNT(ri.ingredient_id) as total
        FROM recipes r
        JOIN recipe_ingredients ri ON r.id = ri.recipe_id
        GROUP BY r.id
        HAVING COUNT(ri.ingredient_id) FILTER (WHERE ri.ingredient_id = ANY(%s))::float 
               / COUNT(ri.ingredient_id) > 0.8
        ORDER BY matches DESC
        LIMIT 10
    """, [ingredient_ids, ingredient_ids])
    
    return {"matches": matches}
```

---

## Frontend Architecture (Next.js)

```
/app
  /page.tsx              ← Homepage / Generator
  /discover/page.tsx     ← Recipe browser
  /pantry/page.tsx       ← Pantry management
  /planner/page.tsx      ← Meal planner
  /recipe/[id]/page.tsx  ← Recipe detail
  /saved/page.tsx        ← Saved collection
  /api
    /generate/route.ts   ← AI generation endpoint
    /recipes/route.ts    ← Recipe CRUD
    /pantry/route.ts     ← Pantry management
/components
  /RecipeCard.tsx
  /RecipeOutput.tsx
  /IngredientSelector.tsx
  /FilterBar.tsx
  /NutritionGrid.tsx
  /MealPlanGrid.tsx
/lib
  /anthropic.ts
  /db.ts
  /cache.ts
  /nutrition.ts
```

---

## AI Prompt Templates

### Recipe Generation
```
System: You are a world-class chef and culinary AI with expertise in global cuisines, nutrition science, and cooking techniques. Always generate creative, practical, restaurant-quality recipes.

User:
Ingredients: {ingredients}
Cuisine: {cuisine}
Diet: {diet}
Time: {time}
Skill: {skill}
Calories: {calories}

Generate a complete recipe. Return ONLY valid JSON.
Schema: {name, cuisine, description, time, difficulty, servings, ingredients:[{amount, name}], steps:[], nutrition:{calories,protein,carbs,fat}, tips}
```

### Recipe Improvement
```
Instruction: "{instruction}"
Apply intelligently to the recipe below. Preserve what works, transform what's needed.
Keep the same JSON schema. Return ONLY valid JSON.
Original: {recipe_json}
```

### Meal Plan
```
Create a {days}-day meal plan for:
- Daily calories: {calories} kcal
- Protein: {protein}g
- Diet: {diet}
- Cuisine preferences: {cuisines}
- Skill level: {skill}

Return JSON: {day: {breakfast, lunch, dinner, snacks, total_calories}}
```

### Grocery List
```
Generate a grocery shopping list from these recipes:
{recipes_json}

Aggregate ingredients (combine duplicates), group by store section.
Return JSON: {produce:[], meat:[], dairy:[], pantry:[], frozen:[]}
```

---

## Data Pipeline

```
External APIs (Spoonacular, Edamam, TheMealDB)
        ↓
    Normalizer Service
        ↓
    Deduplication (fuzzy name matching)
        ↓
    Ingredient Parser & Mapper → ingredients table
        ↓
    Nutrition Enrichment (USDA FoodData)
        ↓
    Embedding Generation (text-embedding-3-small)
        ↓
    Vector Store (Pinecone index)
        ↓
    PostgreSQL (structured storage)
        ↓
    Redis Cache (popular recipes, 24h TTL)
```

---

## Infrastructure & Deployment

### Docker Compose (Development)

```yaml
version: '3.9'
services:
  frontend:
    build: ./frontend
    ports: ["3000:3000"]
    env_file: .env

  api:
    build: ./backend
    ports: ["4000:4000"]
    env_file: .env
    depends_on: [postgres, redis]

  recommendation:
    build: ./recommendation
    ports: ["5000:5000"]
    env_file: .env

  postgres:
    image: pgvector/pgvector:pg16
    environment:
      POSTGRES_DB: culina
      POSTGRES_USER: culina
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes: ["pgdata:/var/lib/postgresql/data"]

  redis:
    image: redis:alpine
    ports: ["6379:6379"]

volumes:
  pgdata:
```

### Environment Variables
```env
# API Keys
ANTHROPIC_API_KEY=sk-ant-...
SPOONACULAR_KEY=...
EDAMAM_APP_ID=...
EDAMAM_KEY=...
USDA_API_KEY=...
PINECONE_API_KEY=...
PINECONE_INDEX=culina-recipes

# Database
DATABASE_URL=postgresql://culina:pass@postgres:5432/culina
REDIS_URL=redis://redis:6379

# Auth
JWT_SECRET=...
NEXTAUTH_SECRET=...
```

### Production (AWS)
```
ECS Fargate (API containers)
RDS PostgreSQL (pgvector extension)
ElastiCache Redis
S3 + CloudFront (media)
ALB (load balancing)
Route53 (DNS)
Vercel (Next.js frontend — recommended)
```

### One-Command Deploy (Vercel + Railway)
```bash
# Frontend
vercel deploy --prod

# Backend (Railway)
railway up

# Database
railway add postgresql
railway add redis
```

---

## Performance & Scaling

| Target | Strategy |
|--------|----------|
| <3s recipe generation | Redis caching + streaming responses |
| Similarity search <100ms | Pinecone ANN index |
| 10k concurrent users | Horizontal ECS scaling |
| Recipe cache hit rate >60% | Ingredient combo hashing |

---

## Extensibility: Future ML Models

1. **Flavor Pairing Model** — Train on FlavorDB dataset to predict ingredient compatibility scores
2. **Photo Recognition** — CLIP-based model for ingredient detection from fridge photos  
3. **Personalized Ranking** — User-specific recipe ranker based on rating history
4. **Recipe Success Predictor** — Estimate recipe difficulty based on technique complexity
5. **Voice Assistant** — Streaming recipe narration with cooking timer integration

All models plug into the Recommendation Engine service via a standard `/models/{model_name}/predict` endpoint.
