# Culina — AI Recipe Platform

Generate, discover, and customize recipes with AI.

## Setup (3 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Add your API key
Copy the example env file and paste your key:
```bash
cp .env.local.example .env.local
```
Then open `.env.local` and replace `sk-ant-PASTE_YOUR_KEY_HERE` with your real key from https://console.anthropic.com/api-keys

### 3. Run
```bash
npm run dev
```

Open http://localhost:3000 — done.

---

## Project Structure

```
culina/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Entry → loads RecipePlatform
│   └── api/
│       └── claude/
│           └── route.ts        # Secure API proxy (keeps key server-side)
├── components/
│   └── RecipePlatform.tsx      # Full app (all pages + AI integration)
├── .env.local                  # Your API key (never commit this)
└── .env.local.example          # Template
```

## Features

- **Generate** — Add ingredients, set cuisine/diet/time/skill filters, generate a full recipe with AI
- **Improve** — One-click transforms: make it keto, reduce calories, add protein, etc.
- **Discover** — Browse 12 curated recipes filterable by cuisine
- **Pantry** — Track your ingredients, get recipe suggestions from what you have
- **Planner** — 7-day AI meal plan with macro targets
- **Save** — Save and manage your favorite recipes

## Deploy to Vercel

```bash
npm i -g vercel
vercel
```

Add `ANTHROPIC_API_KEY` in your Vercel project settings → Environment Variables.
