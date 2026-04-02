"use client";

import { useState, useRef } from "react";

// ─── Design System ─────────────────────────────────────────────────────────
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
`;

const CSS = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --cream: #FAF7F2;
    --warm-white: #F5EFE6;
    --bark: #2C1810;
    --terra: #C4622D;
    --sage: #5C7A5C;
    --gold: #D4A843;
    --smoke: #8B7355;
    --ash: #D4CBC0;
    --charcoal: #1A1A1A;
    --surface: #FFFFFF;
    --border: rgba(44,24,16,0.12);
    --shadow: 0 4px 24px rgba(44,24,16,0.10);
    --shadow-lg: 0 12px 48px rgba(44,24,16,0.16);
  }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--bark);
    line-height: 1.6;
    min-height: 100vh;
  }

  .app { min-height: 100vh; }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(250,247,242,0.92);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 2rem;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.6rem; font-weight: 600;
    color: var(--bark); letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 0.5rem;
  }
  .nav-logo span { color: var(--terra); }
  .nav-tabs { display: flex; gap: 0.25rem; }
  .nav-tab {
    padding: 0.4rem 1rem; border-radius: 100px;
    font-size: 0.875rem; font-weight: 500;
    cursor: pointer; border: none; background: transparent;
    color: var(--smoke); transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-tab:hover { background: var(--warm-white); color: var(--bark); }
  .nav-tab.active { background: var(--bark); color: var(--cream); }
  .nav-badge {
    background: var(--terra); color: white;
    font-size: 0.65rem; padding: 1px 6px;
    border-radius: 100px; margin-left: 4px;
    font-family: 'Space Mono', monospace;
  }

  .page { padding-top: 80px; min-height: 100vh; }

  .hero {
    padding: 4rem 2rem 3rem;
    max-width: 900px; margin: 0 auto;
    text-align: center;
  }
  .hero-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem; letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--terra); margin-bottom: 1.25rem;
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  }
  .hero-eyebrow::before, .hero-eyebrow::after {
    content: ''; height: 1px; width: 40px; background: var(--terra); opacity: 0.5;
  }
  .hero-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2.8rem, 6vw, 5rem);
    font-weight: 300; line-height: 1.08;
    color: var(--bark); margin-bottom: 1rem;
    letter-spacing: -0.02em;
  }
  .hero-title em { font-style: italic; color: var(--terra); }
  .hero-sub {
    font-size: 1.05rem; color: var(--smoke);
    max-width: 520px; margin: 0 auto 2.5rem;
    font-weight: 300;
  }

  .gen-card {
    background: var(--surface);
    border-radius: 20px;
    border: 1px solid var(--border);
    box-shadow: var(--shadow-lg);
    padding: 2rem;
    max-width: 860px; margin: 0 auto 3rem;
  }
  .gen-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.3rem; font-weight: 600;
    margin-bottom: 1.5rem; color: var(--bark);
    display: flex; align-items: center; gap: 0.5rem;
  }

  .ingredient-input-row { display: flex; gap: 0.5rem; margin-bottom: 1rem; }
  .ingredient-input {
    flex: 1; padding: 0.65rem 1rem;
    border: 1.5px solid var(--border); border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    background: var(--cream); color: var(--bark);
    outline: none; transition: border-color 0.2s;
  }
  .ingredient-input:focus { border-color: var(--terra); }
  .ingredient-input::placeholder { color: var(--ash); }
  .btn-add {
    padding: 0.65rem 1.25rem; border-radius: 10px;
    background: var(--terra); color: white;
    border: none; cursor: pointer; font-weight: 500;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    transition: all 0.2s; white-space: nowrap;
  }
  .btn-add:hover { background: #b5541f; transform: translateY(-1px); }

  .chip-list { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-bottom: 1.5rem; min-height: 2rem; }
  .chip {
    display: inline-flex; align-items: center; gap: 0.4rem;
    padding: 0.3rem 0.75rem; border-radius: 100px;
    background: var(--warm-white); border: 1px solid var(--border);
    font-size: 0.82rem; color: var(--bark); font-weight: 500;
    animation: chipIn 0.2s ease;
  }
  @keyframes chipIn { from { transform: scale(0.8); opacity:0; } to { transform:scale(1); opacity:1; } }
  .chip-x {
    background: none; border: none; cursor: pointer;
    color: var(--smoke); font-size: 1rem; line-height: 1;
    padding: 0; display: flex; align-items: center;
  }
  .chip-x:hover { color: var(--terra); }

  .filter-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
  .select-field {
    padding: 0.6rem 0.9rem; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--cream);
    font-family: 'DM Sans', sans-serif; font-size: 0.85rem;
    color: var(--bark); cursor: pointer; outline: none;
    transition: border-color 0.2s; appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238B7355' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat; background-position: right 0.75rem center;
    padding-right: 2.25rem;
  }
  .select-field:focus { border-color: var(--terra); }

  .btn-generate {
    width: 100%; padding: 1rem; border-radius: 12px;
    background: var(--bark); color: var(--cream);
    border: none; cursor: pointer;
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600; letter-spacing: 0.02em;
    transition: all 0.25s; position: relative; overflow: hidden;
    display: flex; align-items: center; justify-content: center; gap: 0.75rem;
  }
  .btn-generate:hover:not(:disabled) { background: #1a0d08; transform: translateY(-2px); box-shadow: var(--shadow); }
  .btn-generate:disabled { opacity: 0.6; cursor: not-allowed; }
  .btn-generate .shimmer {
    position: absolute; inset: 0;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent);
    animation: shimmer 1.5s infinite;
  }
  @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(100%); } }

  .recipe-output { max-width: 860px; margin: 0 auto 4rem; animation: fadeUp 0.4s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }

  .recipe-header {
    background: var(--bark); color: var(--cream);
    border-radius: 20px 20px 0 0; padding: 2.5rem;
    position: relative; overflow: hidden;
  }
  .recipe-header::before {
    content: ''; position: absolute;
    top: -60px; right: -60px; width: 200px; height: 200px;
    background: var(--terra); border-radius: 50%; opacity: 0.15;
  }
  .recipe-header::after {
    content: ''; position: absolute;
    bottom: -40px; left: -40px; width: 140px; height: 140px;
    background: var(--gold); border-radius: 50%; opacity: 0.1;
  }
  .recipe-cuisine-tag {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--gold); margin-bottom: 0.75rem;
  }
  .recipe-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 300; line-height: 1.1; margin-bottom: 0.75rem;
  }
  .recipe-desc { font-size: 0.95rem; opacity: 0.75; max-width: 520px; font-weight: 300; }
  .recipe-meta { display: flex; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .recipe-meta-item { display: flex; flex-direction: column; gap: 0.15rem; }
  .recipe-meta-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.5;
  }
  .recipe-meta-val { font-size: 0.95rem; font-weight: 500; }

  .recipe-body {
    background: var(--surface); border: 1px solid var(--border); border-top: none;
    border-radius: 0 0 20px 20px; padding: 2rem;
    display: grid; grid-template-columns: 1fr 1.6fr; gap: 2rem;
  }
  @media (max-width: 640px) { .recipe-body { grid-template-columns: 1fr; } }

  .recipe-section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.1rem; font-weight: 600;
    color: var(--bark); margin-bottom: 1rem;
    padding-bottom: 0.5rem; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; gap: 0.5rem;
  }

  .ingredient-list { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
  .ingredient-item {
    display: flex; align-items: flex-start; gap: 0.6rem;
    font-size: 0.88rem; padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  .ingredient-item:last-child { border-bottom: none; }
  .ingredient-amount {
    font-family: 'Space Mono', monospace; font-size: 0.78rem;
    color: var(--terra); white-space: nowrap; min-width: 60px; font-weight: 700;
  }

  .step-list { list-style: none; display: flex; flex-direction: column; gap: 1rem; }
  .step-item { display: flex; gap: 1rem; align-items: flex-start; }
  .step-num {
    width: 28px; height: 28px; min-width: 28px;
    background: var(--bark); color: var(--cream);
    border-radius: 50%; font-family: 'Space Mono', monospace;
    font-size: 0.72rem; display: flex; align-items: center; justify-content: center;
    margin-top: 2px;
  }
  .step-text { font-size: 0.9rem; line-height: 1.65; color: var(--charcoal); }

  .nutrition-grid {
    display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem;
    background: var(--warm-white); border-radius: 12px; padding: 1.25rem;
    margin-top: 1.5rem; grid-column: 1 / -1;
  }
  .nutrition-item { text-align: center; }
  .nutrition-val {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.8rem; font-weight: 600;
    color: var(--bark); display: block; line-height: 1;
  }
  .nutrition-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--smoke); margin-top: 0.25rem;
  }

  .recipe-actions {
    display: flex; gap: 0.75rem; margin-top: 1.5rem; flex-wrap: wrap;
    grid-column: 1 / -1;
  }
  .btn-action {
    padding: 0.55rem 1.1rem; border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--cream); color: var(--bark);
    font-size: 0.82rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.2s; display: flex; align-items: center; gap: 0.4rem;
  }
  .btn-action:hover { background: var(--bark); color: var(--cream); border-color: var(--bark); }
  .btn-action.saved { background: var(--sage); color: white; border-color: var(--sage); }

  .improve-panel {
    grid-column: 1 / -1;
    background: var(--warm-white); border-radius: 12px; padding: 1.25rem;
    margin-top: 0.5rem;
  }
  .improve-title {
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--smoke); margin-bottom: 0.75rem;
  }
  .improve-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; }
  .improve-chip {
    padding: 0.4rem 0.9rem; border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--surface); color: var(--bark);
    font-size: 0.8rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .improve-chip:hover { background: var(--terra); color: white; border-color: var(--terra); }

  .discover-page { padding: 2rem; max-width: 1100px; margin: 0 auto; }
  .discover-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 2.2rem; font-weight: 300; margin-bottom: 0.5rem;
  }
  .filter-bar {
    display: flex; gap: 0.75rem; flex-wrap: wrap; margin-bottom: 2rem;
    padding: 1rem 1.25rem; background: var(--surface);
    border-radius: 14px; border: 1px solid var(--border);
    align-items: center;
  }
  .filter-label {
    font-family: 'Space Mono', monospace;
    font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--smoke); white-space: nowrap;
  }
  .filter-chip {
    padding: 0.35rem 0.9rem; border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--cream); color: var(--bark);
    font-size: 0.8rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .filter-chip.active { background: var(--bark); color: var(--cream); border-color: var(--bark); }
  .filter-chip:hover:not(.active) { border-color: var(--bark); }

  .recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px,1fr)); gap: 1.5rem; }
  .recipe-card {
    background: var(--surface); border-radius: 16px;
    border: 1px solid var(--border); overflow: hidden;
    cursor: pointer; transition: all 0.25s;
    animation: fadeUp 0.3s ease;
  }
  .recipe-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .recipe-card-img {
    width: 100%; height: 180px; object-fit: cover;
    background: linear-gradient(135deg, var(--warm-white), var(--ash));
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem; position: relative; overflow: hidden;
  }
  .recipe-card-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, rgba(44,24,16,0.6));
  }
  .recipe-card-tag {
    position: absolute; top: 0.75rem; left: 0.75rem;
    background: var(--terra); color: white;
    font-family: 'Space Mono', monospace; font-size: 0.65rem;
    text-transform: uppercase; letter-spacing: 0.08em;
    padding: 0.25rem 0.6rem; border-radius: 100px;
  }
  .recipe-card-body { padding: 1rem 1.25rem 1.25rem; }
  .recipe-card-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.2rem; font-weight: 600;
    margin-bottom: 0.35rem; line-height: 1.2; color: var(--bark);
  }
  .recipe-card-meta {
    display: flex; gap: 1rem; font-size: 0.78rem; color: var(--smoke);
    font-family: 'Space Mono', monospace;
  }
  .recipe-card-rating { color: var(--gold); }

  .pantry-page { padding: 2rem; max-width: 860px; margin: 0 auto; }
  .pantry-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
  @media (max-width: 600px) { .pantry-grid { grid-template-columns: 1fr; } }
  .pantry-card {
    background: var(--surface); border-radius: 16px;
    border: 1px solid var(--border); padding: 1.5rem;
  }
  .pantry-card-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.15rem; font-weight: 600;
    margin-bottom: 1rem; color: var(--bark);
  }
  .pantry-item {
    display: flex; justify-content: space-between; align-items: center;
    padding: 0.5rem 0; border-bottom: 1px solid var(--border); font-size: 0.88rem;
  }
  .pantry-item:last-child { border-bottom: none; }
  .pantry-item-name { display: flex; align-items: center; gap: 0.5rem; }
  .pantry-item-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--sage); }
  .pantry-item-dot.low { background: var(--terra); }
  .pantry-suggest-btn {
    width: 100%; margin-top: 1.5rem; padding: 0.75rem; border-radius: 10px;
    background: var(--bark); color: var(--cream);
    border: none; cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 500;
    transition: all 0.2s;
  }
  .pantry-suggest-btn:hover { background: #1a0d08; }

  .planner-page { padding: 2rem; max-width: 1000px; margin: 0 auto; }
  .planner-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 0.75rem; margin-top: 1.5rem; }
  @media (max-width: 700px) { .planner-grid { grid-template-columns: repeat(2,1fr); } }
  .planner-day {
    background: var(--surface); border-radius: 12px;
    border: 1px solid var(--border); padding: 1rem;
  }
  .planner-day-name {
    font-family: 'Space Mono', monospace; font-size: 0.68rem;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--smoke); margin-bottom: 0.75rem;
  }
  .planner-meal { margin-bottom: 0.75rem; }
  .planner-meal-type {
    font-family: 'Space Mono', monospace; font-size: 0.6rem;
    text-transform: uppercase; color: var(--terra); letter-spacing: 0.08em; margin-bottom: 0.2rem;
  }
  .planner-meal-name { font-size: 0.78rem; font-weight: 500; color: var(--bark); line-height: 1.3; }
  .planner-cal { font-family: 'Space Mono', monospace; font-size: 0.65rem; color: var(--smoke); margin-top: 0.2rem; }

  .saved-page { padding: 2rem; max-width: 1000px; margin: 0 auto; }

  .loading-state {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 1.5rem; padding: 4rem 2rem; text-align: center;
  }
  .loading-spinner {
    width: 48px; height: 48px;
    border: 3px solid var(--border); border-top-color: var(--terra);
    border-radius: 50%; animation: spin 0.8s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .loading-label { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; color: var(--bark); font-weight: 300; }
  .loading-sublabel { font-size: 0.85rem; color: var(--smoke); }

  .empty-state { text-align: center; padding: 4rem 2rem; color: var(--smoke); }
  .empty-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.4; }
  .empty-text { font-family: 'Cormorant Garamond', serif; font-size: 1.3rem; }

  .toast-container { position: fixed; bottom: 2rem; right: 2rem; z-index: 999; display: flex; flex-direction: column; gap: 0.5rem; }
  .toast {
    background: var(--bark); color: var(--cream);
    padding: 0.75rem 1.25rem; border-radius: 10px;
    font-size: 0.88rem; font-weight: 500; box-shadow: var(--shadow);
    animation: toastIn 0.3s ease; display: flex; align-items: center; gap: 0.5rem;
  }
  @keyframes toastIn { from { transform: translateX(20px); opacity:0; } to { transform:translateX(0); opacity:1; } }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--ash); border-radius: 3px; }
`;

// ─── Constants ──────────────────────────────────────────────────────────────
const CUISINES = ["Any Cuisine","Italian","Mexican","Japanese","Indian","Mediterranean","Thai","French","Chinese","American","Greek","Korean","Middle Eastern"];
const DIETS = ["No Restrictions","Vegetarian","Vegan","Keto","Paleo","Gluten-Free","Dairy-Free","Low-Carb","High-Protein"];
const TIMES = ["Any Time","Under 15 min","Under 30 min","Under 1 hour","1-2 hours"];
const SKILLS = ["Any Level","Beginner","Intermediate","Advanced"];
const CALORIE_OPTIONS = ["Any Calories","Under 300 cal","300-500 cal","500-700 cal","700+ cal"];
const IMPROVE_PROMPTS = ["Make it vegetarian","Reduce calories by 30%","Make it high protein","Turn into meal prep","Make it keto","Add more vegetables","Make it spicier","Reduce cooking time","Make it dairy-free","Add a flavor twist"];

const SAMPLE_RECIPES = [
  { id:1, name:"Roasted Garlic Pasta al Limone", cuisine:"Italian", time:"25 min", calories:480, rating:4.8, emoji:"🍝", diff:"Easy" },
  { id:2, name:"Miso-Glazed Salmon Bowl", cuisine:"Japanese", time:"30 min", calories:520, rating:4.9, emoji:"🐟", diff:"Intermediate" },
  { id:3, name:"Smoky Black Bean Tacos", cuisine:"Mexican", time:"20 min", calories:380, rating:4.7, emoji:"🌮", diff:"Easy" },
  { id:4, name:"Saffron Chicken Tagine", cuisine:"Moroccan", time:"1.5 hr", calories:610, rating:4.6, emoji:"🫕", diff:"Advanced" },
  { id:5, name:"Thai Basil Fried Rice", cuisine:"Thai", time:"15 min", calories:450, rating:4.7, emoji:"🍚", diff:"Easy" },
  { id:6, name:"Shakshuka with Feta", cuisine:"Middle Eastern", time:"25 min", calories:340, rating:4.8, emoji:"🍳", diff:"Easy" },
  { id:7, name:"Beef Bulgogi Bibimbap", cuisine:"Korean", time:"45 min", calories:590, rating:4.9, emoji:"🥩", diff:"Intermediate" },
  { id:8, name:"Pesto Gnocchi with Burrata", cuisine:"Italian", time:"20 min", calories:560, rating:4.6, emoji:"🧆", diff:"Easy" },
  { id:9, name:"Harissa Roasted Cauliflower", cuisine:"Mediterranean", time:"40 min", calories:280, rating:4.5, emoji:"🥦", diff:"Easy" },
  { id:10, name:"Duck Confit with Cherry Jus", cuisine:"French", time:"3 hr", calories:720, rating:4.9, emoji:"🍖", diff:"Advanced" },
  { id:11, name:"Paneer Butter Masala", cuisine:"Indian", time:"35 min", calories:490, rating:4.8, emoji:"🍛", diff:"Intermediate" },
  { id:12, name:"Avocado Tuna Poke Bowl", cuisine:"Hawaiian", time:"15 min", calories:430, rating:4.7, emoji:"🥑", diff:"Easy" },
];

const PANTRY_ITEMS = [
  { name:"Chicken Breast", qty:"500g", status:"ok" },
  { name:"Garlic", qty:"1 bulb", status:"ok" },
  { name:"Cherry Tomatoes", qty:"250g", status:"ok" },
  { name:"Pasta (spaghetti)", qty:"200g", status:"low" },
  { name:"Olive Oil", qty:"250ml", status:"ok" },
  { name:"Parmesan", qty:"80g", status:"low" },
  { name:"Lemon", qty:"2", status:"ok" },
  { name:"Eggs", qty:"4", status:"ok" },
];

const MEAL_PLAN: Record<string, {b:string;l:string;d:string;cal:number}> = {
  Mon: { b:"Greek Yogurt Parfait", l:"Chicken Caesar Wrap", d:"Salmon Teriyaki", cal:1820 },
  Tue: { b:"Avocado Toast", l:"Lentil Soup", d:"Beef Stir Fry", cal:1750 },
  Wed: { b:"Overnight Oats", l:"Caprese Salad", d:"Pasta Primavera", cal:1680 },
  Thu: { b:"Smoothie Bowl", l:"Turkey Panini", d:"Chicken Tikka", cal:1900 },
  Fri: { b:"Eggs Benedict", l:"Poke Bowl", d:"Margherita Pizza", cal:1980 },
  Sat: { b:"French Toast", l:"Caesar Salad", d:"BBQ Ribs", cal:2100 },
  Sun: { b:"Shakshuka", l:"Mezze Platter", d:"Roast Chicken", cal:1850 },
};

// ─── Types ───────────────────────────────────────────────────────────────────
interface Ingredient { amount: string; name: string; }
interface Nutrition { calories: number; protein: number; carbs: number; fat: number; }
interface Recipe {
  name: string; cuisine: string; description: string;
  time: string; difficulty: string; servings: number;
  ingredients: Ingredient[]; steps: string[];
  nutrition: Nutrition; tips?: string;
  emoji?: string; calories?: number; rating?: number;
}

// ─── API ─────────────────────────────────────────────────────────────────────
async function callClaude(prompt: string): Promise<Recipe> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [{ role: "user", content: prompt }]
    })
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  const text = (data.content as Array<{type:string;text?:string}>)
    ?.map(b => b.text || "").join("") || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

function buildRecipePrompt(p: {ingredients:string[];cuisine:string;diet:string;time:string;skill:string;calories:string}) {
  const ing = p.ingredients.length ? p.ingredients.join(", ") : "pantry staples";
  return `You are a world-class chef AI. Create a restaurant-quality recipe.

Ingredients: ${ing}
Cuisine: ${p.cuisine || "any"}
Diet: ${p.diet || "none"}
Time: ${p.time || "flexible"}
Skill: ${p.skill || "intermediate"}
Calories: ${p.calories || "flexible"}

Respond ONLY with valid JSON, no markdown:
{"name":"...","cuisine":"...","description":"...","time":"...","difficulty":"Easy|Intermediate|Advanced","servings":2,"ingredients":[{"amount":"...","name":"..."}],"steps":["..."],"nutrition":{"calories":0,"protein":0,"carbs":0,"fat":0},"tips":"..."}`;
}

function buildImprovePrompt(recipe: Recipe, instruction: string) {
  return `Modify this recipe per the instruction. Return ONLY valid JSON in the same schema.

Recipe: ${JSON.stringify(recipe)}
Instruction: "${instruction}"`;
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ toasts }: { toasts: Array<{id:number;msg:string;icon:string}> }) {
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className="toast">{t.icon} {t.msg}</div>
      ))}
    </div>
  );
}

// ─── RecipeOutput ─────────────────────────────────────────────────────────────
function RecipeOutput({ recipe, saved, onSave, onImprove }: {
  recipe: Recipe; saved: boolean;
  onSave: () => void; onImprove: (i: string) => void;
}) {
  return (
    <div className="recipe-output">
      <div className="recipe-header">
        <div className="recipe-cuisine-tag">✦ {recipe.cuisine}</div>
        <div className="recipe-name">{recipe.name}</div>
        <div className="recipe-desc">{recipe.description}</div>
        <div className="recipe-meta">
          {[["Time", `⏱ ${recipe.time}`],["Difficulty",`◆ ${recipe.difficulty}`],["Servings",`◎ ${recipe.servings}`],["Calories",`🔥 ${recipe.nutrition?.calories}`]].map(([label,val])=>(
            <div key={label} className="recipe-meta-item">
              <span className="recipe-meta-label">{label}</span>
              <span className="recipe-meta-val">{val}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="recipe-body">
        <div>
          <div className="recipe-section-title">◎ Ingredients</div>
          <ul className="ingredient-list">
            {recipe.ingredients?.map((ing, i) => (
              <li key={i} className="ingredient-item">
                <span className="ingredient-amount">{ing.amount}</span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
          {recipe.tips && (
            <div style={{marginTop:"1.25rem",padding:"0.75rem 1rem",background:"var(--warm-white)",borderRadius:"10px",fontSize:"0.82rem",color:"var(--smoke)",borderLeft:"3px solid var(--gold)"}}>
              <strong style={{fontFamily:"Space Mono,monospace",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--gold)",display:"block",marginBottom:"0.25rem"}}>Pro Tip</strong>
              {recipe.tips}
            </div>
          )}
        </div>
        <div>
          <div className="recipe-section-title">◈ Instructions</div>
          <ol className="step-list">
            {recipe.steps?.map((step, i) => (
              <li key={i} className="step-item">
                <span className="step-num">{i+1}</span>
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
              <button key={p} className="improve-chip" onClick={() => onImprove(p)}>{p}</button>
            ))}
          </div>
        </div>
        <div className="recipe-actions">
          <button className={`btn-action${saved?" saved":""}`} onClick={onSave}>
            {saved ? "✓ Saved" : "♡ Save Recipe"}
          </button>
          <button className="btn-action" onClick={() => {
            const txt = `${recipe.name}\n\nIngredients:\n${recipe.ingredients?.map(i=>`${i.amount} ${i.name}`).join('\n')}\n\nSteps:\n${recipe.steps?.map((s,i)=>`${i+1}. ${s}`).join('\n')}`;
            navigator.clipboard.writeText(txt);
          }}>↗ Copy</button>
          <button className="btn-action">🛒 Grocery List</button>
          <button className="btn-action">📅 Add to Planner</button>
        </div>
      </div>
    </div>
  );
}

// ─── GeneratorPage ────────────────────────────────────────────────────────────
function GeneratorPage({ onSave, savedIds }: { onSave: (r:Recipe)=>void; savedIds: Set<string> }) {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [input, setInput] = useState("");
  const [cuisine, setCuisine] = useState("Any Cuisine");
  const [diet, setDiet] = useState("No Restrictions");
  const [time, setTime] = useState("Any Time");
  const [skill, setSkill] = useState("Any Level");
  const [calories, setCalories] = useState("Any Calories");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<Recipe|null>(null);
  const [error, setError] = useState<string|null>(null);
  const [improving, setImproving] = useState(false);

  const addIngredient = () => {
    const v = input.trim().toLowerCase();
    if (v && !ingredients.includes(v)) setIngredients(p => [...p, v]);
    setInput("");
  };

  const generate = async () => {
    setLoading(true); setError(null); setRecipe(null);
    try {
      const result = await callClaude(buildRecipePrompt({ ingredients, cuisine, diet, time, skill, calories }));
      setRecipe(result);
    } catch { setError("Generation failed — check your API key in .env.local and try again."); }
    finally { setLoading(false); }
  };

  const improve = async (instruction: string) => {
    if (!recipe || improving) return;
    setImproving(true);
    try {
      const result = await callClaude(buildImprovePrompt(recipe, instruction));
      setRecipe(result);
    } catch { setError("Improvement failed — please try again."); }
    finally { setImproving(false); }
  };

  const QUICK = ["chicken","garlic","tomatoes","pasta","lemon","onion","ginger","rice","eggs","cheese"];

  return (
    <div className="page">
      <div className="hero">
        <div className="hero-eyebrow">AI-Powered Recipe Creation</div>
        <h1 className="hero-title">Turn any ingredients<br/>into <em>extraordinary</em> meals</h1>
        <p className="hero-sub">Tell us what you have. Our AI generates complete, restaurant-quality recipes tailored to your taste, diet, and time.</p>
      </div>
      <div className="gen-card">
        <div className="gen-card-title"><span style={{fontSize:"1.4rem"}}>◎</span> Your Ingredients</div>
        <div className="ingredient-input-row">
          <input className="ingredient-input" placeholder="Add an ingredient (e.g. chicken, garlic…)"
            value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&addIngredient()} />
          <button className="btn-add" onClick={addIngredient}>+ Add</button>
        </div>
        <div style={{marginBottom:"0.75rem"}}>
          <span style={{fontSize:"0.65rem",color:"var(--smoke)",marginRight:"0.5rem",fontFamily:"Space Mono,monospace",textTransform:"uppercase",letterSpacing:"0.08em"}}>Quick add:</span>
          {QUICK.map(q=>(
            <button key={q} onClick={()=>setIngredients(p=>p.includes(q)?p:[...p,q])}
              style={{background:"none",border:"1px solid var(--border)",borderRadius:"100px",padding:"0.2rem 0.6rem",fontSize:"0.78rem",cursor:"pointer",marginRight:"0.35rem",marginBottom:"0.35rem",color:"var(--smoke)",fontFamily:"DM Sans,sans-serif"}}>
              {q}
            </button>
          ))}
        </div>
        <div className="chip-list">
          {ingredients.length===0 && <span style={{fontSize:"0.82rem",color:"var(--ash)",fontStyle:"italic"}}>No ingredients added yet</span>}
          {ingredients.map(ing=>(
            <span key={ing} className="chip">
              {ing}
              <button className="chip-x" onClick={()=>setIngredients(p=>p.filter(i=>i!==ing))}>×</button>
            </span>
          ))}
        </div>
        <div style={{borderTop:"1px solid var(--border)",paddingTop:"1.25rem",marginBottom:"1.25rem"}}>
          <div style={{fontSize:"0.65rem",fontFamily:"Space Mono,monospace",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--smoke)",marginBottom:"0.75rem"}}>Preferences</div>
          <div className="filter-row">
            <select className="select-field" value={cuisine} onChange={e=>setCuisine(e.target.value)}>{CUISINES.map(c=><option key={c}>{c}</option>)}</select>
            <select className="select-field" value={diet} onChange={e=>setDiet(e.target.value)}>{DIETS.map(d=><option key={d}>{d}</option>)}</select>
            <select className="select-field" value={time} onChange={e=>setTime(e.target.value)}>{TIMES.map(t=><option key={t}>{t}</option>)}</select>
            <select className="select-field" value={skill} onChange={e=>setSkill(e.target.value)}>{SKILLS.map(s=><option key={s}>{s}</option>)}</select>
            <select className="select-field" value={calories} onChange={e=>setCalories(e.target.value)}>{CALORIE_OPTIONS.map(c=><option key={c}>{c}</option>)}</select>
          </div>
        </div>
        <button className="btn-generate" onClick={generate} disabled={loading||improving}>
          {loading||improving ? <><div className="shimmer"/><span>{loading?"Generating your recipe…":"Improving recipe…"}</span></> : <><span style={{fontSize:"1.3rem"}}>✦</span><span>Generate Recipe with AI</span></>}
        </button>
        {error && <div style={{marginTop:"1rem",padding:"0.75rem 1rem",background:"#FFF0EE",border:"1px solid #FFCDC6",borderRadius:"10px",fontSize:"0.85rem",color:"#C4622D"}}>{error}</div>}
      </div>
      {loading && (
        <div className="loading-state">
          <div className="loading-spinner"/>
          <div>
            <div className="loading-label">Crafting your recipe…</div>
            <div className="loading-sublabel">Our AI is combining flavors, calculating nutrition, and perfecting instructions.</div>
          </div>
        </div>
      )}
      {recipe && !loading && (
        <RecipeOutput recipe={recipe} saved={savedIds.has(recipe.name)} onSave={()=>onSave(recipe)} onImprove={improve} />
      )}
    </div>
  );
}

// ─── DiscoverPage ─────────────────────────────────────────────────────────────
function DiscoverPage({ onSave, savedIds }: { onSave:(r:Recipe)=>void; savedIds:Set<string> }) {
  const [filter, setFilter] = useState("All");
  const filters = ["All","Italian","Japanese","Mexican","Indian","Mediterranean","Thai","Korean","French"];
  const shown = filter==="All" ? SAMPLE_RECIPES : SAMPLE_RECIPES.filter(r=>r.cuisine===filter);
  return (
    <div className="page">
      <div className="discover-page">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Recipe Collection</div>
          <div className="discover-title">Discover <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>exceptional</em> dishes</div>
          <p style={{color:"var(--smoke)",fontSize:"0.9rem"}}>Browse curated recipes from global cuisines.</p>
        </div>
        <div className="filter-bar">
          <span className="filter-label">Cuisine:</span>
          {filters.map(f=><button key={f} className={`filter-chip${filter===f?" active":""}`} onClick={()=>setFilter(f)}>{f}</button>)}
        </div>
        <div className="recipe-grid">
          {shown.map(r=>(
            <div key={r.id} className="recipe-card">
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
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PantryPage ───────────────────────────────────────────────────────────────
function PantryPage({ onGenerateFromPantry }: { onGenerateFromPantry:()=>void }) {
  const [items, setItems] = useState(PANTRY_ITEMS);
  const [newItem, setNewItem] = useState("");
  const add = () => {
    if (newItem.trim()) { setItems(p=>[...p,{name:newItem.trim(),qty:"1 unit",status:"ok"}]); setNewItem(""); }
  };
  return (
    <div className="page">
      <div className="pantry-page">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Smart Pantry</div>
          <div className="discover-title">Your <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>pantry</em></div>
        </div>
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"1.5rem"}}>
          <input className="ingredient-input" placeholder="Add ingredient to pantry…" value={newItem} onChange={e=>setNewItem(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()}/>
          <button className="btn-add" onClick={add}>+ Add</button>
        </div>
        <div className="pantry-grid">
          <div className="pantry-card">
            <div className="pantry-card-title">◎ Current Stock</div>
            {items.map((item,i)=>(
              <div key={i} className="pantry-item">
                <div className="pantry-item-name">
                  <span className={`pantry-item-dot${item.status==="low"?" low":""}`}/>
                  {item.name}
                </div>
                <span style={{fontSize:"0.78rem",color:"var(--smoke)",fontFamily:"Space Mono,monospace"}}>{item.qty}</span>
              </div>
            ))}
            <button className="pantry-suggest-btn" onClick={onGenerateFromPantry}>✦ Generate Recipe from Pantry</button>
          </div>
          <div>
            <div className="pantry-card" style={{marginBottom:"1rem"}}>
              <div className="pantry-card-title">🛒 Shopping Suggestions</div>
              {[["Olive Oil","Running low"],["Parmesan","Running low"],["Heavy Cream","Recipe needs"],["Basil","Recipe needs"]].map(([item,reason])=>(
                <div key={item} className="pantry-item">
                  <div className="pantry-item-name"><span className="pantry-item-dot low"/>{item}</div>
                  <span style={{fontSize:"0.75rem",color:"var(--terra)"}}>{reason}</span>
                </div>
              ))}
            </div>
            <div className="pantry-card">
              <div className="pantry-card-title">◈ Recipe Suggestions</div>
              {["Aglio e Olio","Chicken Piccata","Frittata","Lemon Pasta"].map(r=>(
                <div key={r} style={{padding:"0.4rem 0",fontSize:"0.88rem",borderBottom:"1px solid var(--border)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <span>{r}</span>
                  <span style={{fontSize:"0.75rem",color:"var(--sage)",fontFamily:"Space Mono,monospace"}}>95% match</span>
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
function PlannerPage() {
  const days = Object.keys(MEAL_PLAN);
  return (
    <div className="page">
      <div className="planner-page">
        <div style={{marginBottom:"1.5rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>AI Meal Planner</div>
          <div className="discover-title">Weekly <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>meal plan</em></div>
        </div>
        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
          {[["Target","1800 kcal/day"],["Protein","120g"],["Carbs","200g"],["Fat","65g"]].map(([label,val])=>(
            <div key={label} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"12px",padding:"0.75rem 1.25rem",textAlign:"center"}}>
              <div style={{fontFamily:"Space Mono,monospace",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--smoke)",marginBottom:"0.2rem"}}>{label}</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.3rem",fontWeight:600,color:"var(--bark)"}}>{val}</div>
            </div>
          ))}
          <button style={{padding:"0.75rem 1.25rem",borderRadius:"12px",background:"var(--terra)",color:"white",border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.9rem",fontWeight:500,marginLeft:"auto"}}>✦ Regenerate Plan</button>
        </div>
        <div className="planner-grid">
          {days.map(day=>(
            <div key={day} className="planner-day">
              <div className="planner-day-name">{day}</div>
              {(["b","l","d"] as const).map((key,i)=>(
                <div key={key} className="planner-meal">
                  <div className="planner-meal-type">{["Breakfast","Lunch","Dinner"][i]}</div>
                  <div className="planner-meal-name">{MEAL_PLAN[day][key]}</div>
                </div>
              ))}
              <div className="planner-cal">{MEAL_PLAN[day].cal} kcal</div>
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
    <div className="page">
      <div className="saved-page">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Your Collection</div>
          <div className="discover-title">Saved <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>recipes</em></div>
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
              <div key={i} className="recipe-card">
                <div className="recipe-card-img">
                  <span style={{position:"relative",zIndex:1,fontSize:"3rem"}}>{r.emoji||"🍽️"}</span>
                  <div className="recipe-card-img-overlay"/>
                  <span className="recipe-card-tag">{r.cuisine||"Custom"}</span>
                </div>
                <div className="recipe-card-body">
                  <div className="recipe-card-name">{r.name}</div>
                  <div className="recipe-card-meta">
                    <span>⏱ {r.time||"—"}</span>
                    <span>🔥 {r.nutrition?.calories||r.calories||"—"} cal</span>
                  </div>
                  <button className="btn-action" style={{marginTop:"0.75rem",width:"100%",justifyContent:"center",background:"var(--warm-white)"}} onClick={()=>onRemove(r)}>
                    Remove
                  </button>
                </div>
              </div>
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
  const [saved, setSaved] = useState<Recipe[]>([]);
  const [toasts, setToasts] = useState<Array<{id:number;msg:string;icon:string}>>([]);
  const toastRef = useRef(0);

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

  const savedIds = new Set(saved.map(r=>r.name));

  return (
    <>
      <style>{FONTS}{CSS}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo"><span style={{fontSize:"1.2rem"}}>◈</span> Culi<span>na</span></div>
          <div className="nav-tabs">
            {[{id:"generate",label:"Generate"},{id:"discover",label:"Discover"},{id:"pantry",label:"Pantry"},{id:"planner",label:"Planner"},{id:"saved",label:"Saved",badge:saved.length||null}].map(t=>(
              <button key={t.id} className={`nav-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}{t.badge?<span className="nav-badge">{t.badge}</span>:null}
              </button>
            ))}
          </div>
        </nav>
        {tab==="generate" && <GeneratorPage onSave={handleSave} savedIds={savedIds}/>}
        {tab==="discover" && <DiscoverPage onSave={handleSave} savedIds={savedIds}/>}
        {tab==="pantry" && <PantryPage onGenerateFromPantry={()=>setTab("generate")}/>}
        {tab==="planner" && <PlannerPage/>}
        {tab==="saved" && <SavedPage saved={saved} onRemove={handleSave}/>}
        <Toast toasts={toasts}/>
      </div>
    </>
  );
}
