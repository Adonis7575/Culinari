"use client";

// Culinaria: multi-select dietary needs, textures, expanded cuisines, cook mode, scaling, and surprise.
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ArrowRight,
  CaretDown,
  ChefHat,
  Clock,
  Diamond,
  GlobeHemisphereWest,
  Leaf,
  Plus,
  SlidersHorizontal,
  Sparkle,
  X,
} from "@phosphor-icons/react";

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
    --focus: oklch(0.66 0.16 42);
    --error: oklch(0.56 0.18 31);
    --error-bg: oklch(0.96 0.03 31);
    --error-border: oklch(0.86 0.08 31);
  }

  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    background: var(--cream);
    color: var(--bark);
    line-height: 1.6;
    min-height: 100vh;
  }

  button, input, select, textarea { font: inherit; }
  button { touch-action: manipulation; }
  button:active:not(:disabled) { transform: translateY(1px); }
  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 3px;
  }

  .app { min-height: 100vh; }
  .skip-link {
    position: fixed; top: 0.5rem; left: 0.5rem; z-index: 1000;
    padding: 0.65rem 1rem; border-radius: 8px;
    background: var(--bark); color: var(--cream);
    transform: translateY(-150%);
    transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1);
  }
  .skip-link:focus { transform: translateY(0); }
  .sr-only {
    position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
    overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
  }

  .nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(250,247,242,0.96);
    backdrop-filter: blur(16px);
    border-bottom: 1px solid transparent;
    padding: 0 3.25rem;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.75rem; font-weight: 600;
    color: var(--bark); letter-spacing: -0.02em;
    display: flex; align-items: center; gap: 0.5rem;
    white-space: nowrap;
  }
  .nav-logo-mark, .nav-logo-accent { color: var(--terra); }
  .nav-tabs { display: flex; gap: 0.25rem; }
  .nav-tab {
    min-height: 44px; padding: 0.55rem 1.2rem; border-radius: 100px;
    font-size: 0.875rem; font-weight: 500;
    cursor: pointer; border: none; background: transparent;
    color: var(--smoke); transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .nav-tab:hover { background: var(--warm-white); color: var(--bark); }
  .nav-tab.active { background: var(--terra); color: white; }
  .nav-tab:focus-visible { outline-offset: 2px; }
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
    min-width: 0; min-height: 44px;
    border: 1.5px solid var(--border); border-radius: 10px;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    background: var(--cream); color: var(--bark);
    outline: none; transition: border-color 0.2s;
  }
  .ingredient-input:focus { border-color: var(--terra); }
  .ingredient-input::placeholder { color: var(--ash); }
  .btn-add {
    padding: 0.65rem 1.25rem; border-radius: 10px;
    min-height: 44px;
    background: var(--terra); color: white;
    border: none; cursor: pointer; font-weight: 500;
    font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    transition: all 0.2s; white-space: nowrap;
  }
  .btn-add:hover { background: #b5541f; transform: translateY(-1px); }
  .quick-add {
    min-height: 34px; padding: 0.25rem 0.7rem;
    border: 1px solid var(--border); border-radius: 100px;
    background: transparent; color: var(--smoke);
    font-size: 0.78rem; cursor: pointer;
    margin: 0 0.35rem 0.35rem 0;
  }
  .quick-add:hover { border-color: var(--terra); color: var(--bark); }
  .quick-add[aria-pressed="true"] {
    background: var(--warm-white); border-color: var(--terra); color: var(--bark);
  }

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
    width: 28px; height: 28px; padding: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .chip-x:hover { color: var(--terra); }

  .filter-row { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px,1fr)); gap: 0.75rem; margin-bottom: 1.5rem; }
  .select-field {
    padding: 0.6rem 0.9rem; border-radius: 10px;
    min-height: 44px;
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
  .recipe-section-heading { font: inherit; }
  .recipe-tip {
    margin-top: 1.25rem; padding: 0.8rem 1rem;
    background: var(--warm-white); border-radius: 10px;
    border: 1px solid color-mix(in srgb, var(--gold) 45%, transparent);
    font-size: 0.82rem; color: var(--smoke);
  }
  .recipe-tip-label {
    display: block; margin-bottom: 0.25rem;
    font-family: 'Space Mono', monospace;
    font-size: 0.65rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--gold);
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
    appearance: none; width: 100%; text-align: left;
    font-family: inherit; color: inherit;
  }
  .recipe-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
  .recipe-card:focus-visible {
    transform: translateY(-4px); box-shadow: var(--shadow-lg);
    outline: 3px solid var(--focus); outline-offset: 3px;
  }
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

  .modal-overlay {
    position: fixed; inset: 0; z-index: 300;
    background: rgba(44,24,16,0.55); backdrop-filter: blur(6px);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 2rem 1rem 4rem; overflow-y: auto;
  }
  .modal-inner {
    width: 100%; max-width: 900px; position: relative; padding-top: 0.25rem;
  }
  .modal-close {
    position: fixed; top: 1.25rem; right: 1.25rem; z-index: 301;
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 50%; width: 44px; height: 44px;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; font-size: 1.1rem; color: var(--bark);
    box-shadow: var(--shadow); transition: all 0.2s;
  }
  .modal-close:hover { background: var(--warm-white); transform: scale(1.08); }
  .modal-loading-card {
    background: var(--surface); border-radius: 20px;
    border: 1px solid var(--border); box-shadow: var(--shadow-lg);
    animation: fadeUp 0.3s ease;
  }
  .modal-error-card {
    background: var(--surface); border-radius: 20px;
    border: 1px solid var(--border); box-shadow: var(--shadow-lg);
    padding: 3rem 2rem; text-align: center;
    animation: fadeUp 0.3s ease;
  }
  .recipe-card-hint {
    font-size: 0.75rem; color: var(--terra); margin-top: 0.5rem;
    font-family: 'Space Mono', monospace; letter-spacing: 0.04em;
    opacity: 0; transition: opacity 0.2s;
  }
  .recipe-card:hover .recipe-card-hint { opacity: 1; }
  .improve-overlay {
    position: absolute; inset: 0; border-radius: 20px; z-index: 10;
    background: rgba(250,247,242,0.88); backdrop-filter: blur(3px);
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
  }

  .planner-picker-panel {
    position: absolute; top: calc(100% + 0.5rem); right: 0; z-index: 200;
    background: var(--surface); border: 1px solid var(--border); border-radius: 14px;
    padding: 1rem; box-shadow: var(--shadow-lg); min-width: 220px;
    display: flex; flex-direction: column; gap: 0.75rem;
  }
  .planner-picker-label {
    font-family: 'Space Mono', monospace; font-size: 0.65rem;
    text-transform: uppercase; letter-spacing: 0.1em; color: var(--smoke); margin-bottom: 0.35rem;
  }
  .picker-day-grid { display: flex; flex-wrap: wrap; gap: 0.3rem; }
  .picker-meal-row { display: flex; gap: 0.3rem; }
  .picker-chip {
    padding: 0.25rem 0.55rem; border-radius: 100px; border: 1.5px solid var(--border);
    background: var(--cream); color: var(--bark); font-size: 0.75rem; font-weight: 500;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .picker-chip.active { background: var(--bark); color: var(--cream); border-color: var(--bark); }
  .picker-chip:hover:not(.active) { border-color: var(--smoke); }
  .btn-picker-confirm {
    padding: 0.5rem; border-radius: 8px; background: var(--terra); color: white;
    border: none; cursor: pointer; font-family: 'DM Sans', sans-serif;
    font-size: 0.85rem; font-weight: 500; transition: background 0.2s;
  }
  .btn-picker-confirm:hover { background: #b5541f; }

  .pantry-item-edit { flex: 1; display: flex; flex-direction: column; gap: 0.4rem; padding: 0.25rem 0; }
  .pantry-item-controls { display: flex; align-items: center; gap: 0.4rem; }
  .pantry-item-actions { display: flex; align-items: center; gap: 0.4rem; }
  .pantry-icon-btn {
    background: none; border: none; cursor: pointer; padding: 0.15rem 0.35rem;
    min-width: 32px; min-height: 32px;
    font-size: 0.9rem; border-radius: 6px; transition: all 0.15s; line-height: 1;
  }
  .pantry-icon-btn.edit { color: var(--smoke); }
  .pantry-icon-btn.edit:hover { background: var(--warm-white); color: var(--bark); }
  .pantry-icon-btn.delete { color: var(--ash); }
  .pantry-icon-btn.delete:hover { background: #FFF0EE; color: var(--terra); }
  .pantry-status-toggle {
    padding: 0.2rem 0.55rem; border-radius: 100px; border: 1.5px solid var(--border);
    font-size: 0.72rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.15s; white-space: nowrap;
  }
  .pantry-status-toggle.ok { background: #EEF5EE; color: var(--sage); border-color: var(--sage); }
  .pantry-status-toggle.low { background: #FFF0EE; color: var(--terra); border-color: var(--terra); }
  .pantry-edit-save {
    padding: 0.25rem 0.6rem; border-radius: 6px; background: var(--sage); color: white;
    border: none; cursor: pointer; font-size: 0.78rem; font-weight: 500;
  }
  .pantry-edit-cancel {
    padding: 0.25rem 0.6rem; border-radius: 6px; background: var(--warm-white); color: var(--smoke);
    border: 1px solid var(--border); cursor: pointer; font-size: 0.78rem;
  }

  /* ── Dietary needs panel ── */
  .diet-panel-toggle {
    width: 100%; display: flex; justify-content: space-between; align-items: center;
    min-height: 44px; background: none; border: none; cursor: pointer; padding: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .diet-panel-toggle:hover .diet-panel-arrow { color: var(--terra); }
  .diet-panel-arrow { color: var(--smoke); font-size: 0.85rem; transition: color 0.2s; }
  .diet-panel { margin-top: 1rem; display: flex; flex-direction: column; gap: 1.25rem; animation: fadeUp 0.25s ease; }
  .diet-group-label {
    font-family: 'Space Mono', monospace; font-size: 0.68rem;
    text-transform: uppercase; letter-spacing: 0.1em;
    color: var(--terra); margin-bottom: 0.6rem;
  }
  .diet-chip {
    padding: 0.4rem 0.9rem; border-radius: 100px;
    border: 1.5px solid var(--border);
    background: var(--surface); color: var(--bark);
    font-size: 0.8rem; font-weight: 500; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .diet-chip:hover { border-color: var(--sage); }
  .diet-chip.active { background: var(--sage); color: white; border-color: var(--sage); }
  .diet-custom { width: 100%; resize: vertical; line-height: 1.5; font-family: 'DM Sans', sans-serif; }
  .texture-note {
    margin-top: 0.75rem; font-size: 0.78rem; color: var(--sage);
    font-family: 'Space Mono', monospace; letter-spacing: 0.02em;
  }
  .diet-disclaimer {
    font-size: 0.78rem; line-height: 1.55; color: var(--smoke);
    max-width: 68ch;
  }

  /* ── Generate row + surprise ── */
  .generate-row { display: flex; gap: 0.75rem; }
  .generate-row .btn-generate { flex: 1; }
  .btn-surprise {
    padding: 1rem 1.5rem; border-radius: 12px;
    background: var(--surface); color: var(--bark);
    border: 1.5px solid var(--border); cursor: pointer;
    font-family: 'DM Sans', sans-serif; font-size: 0.95rem; font-weight: 600;
    transition: all 0.25s; white-space: nowrap;
  }
  .btn-surprise:hover:not(:disabled) { border-color: var(--gold); background: #FDF8EC; transform: translateY(-2px) rotate(-1deg); }
  .btn-surprise:disabled { opacity: 0.5; cursor: not-allowed; }
  @media (max-width: 560px) { .generate-row { flex-direction: column; } }

  /* ── Serving stepper ── */
  .serving-stepper { display: inline-flex; align-items: center; gap: 0.4rem; }
  .serving-btn {
    width: 36px; height: 36px; min-width: 36px; border-radius: 50%;
    border: 1px solid rgba(250,247,242,0.35); background: rgba(250,247,242,0.1);
    color: var(--cream); cursor: pointer; font-size: 0.9rem; line-height: 1;
    display: inline-flex; align-items: center; justify-content: center;
    transition: all 0.15s;
  }
  .serving-btn:hover { background: var(--terra); border-color: var(--terra); }
  .serving-count { min-width: 42px; text-align: center; }
  .serving-note {
    font-family: 'Space Mono', monospace; font-size: 0.62rem;
    color: var(--gold); margin-top: 0.2rem; display: block;
  }

  /* ── Cook mode ── */
  .cook-mode-toggle {
    padding: 0.3rem 0.85rem; border-radius: 100px;
    border: 1.5px solid var(--border); background: var(--cream);
    color: var(--bark); font-size: 0.75rem; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s;
  }
  .cook-mode-toggle:hover { border-color: var(--sage); }
  .cook-mode-toggle.on { background: var(--sage); color: white; border-color: var(--sage); }
  .cook-progress { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem; }
  .cook-progress-bar {
    flex: 1; height: 6px; border-radius: 100px;
    background: var(--warm-white); overflow: hidden;
  }
  .cook-progress-fill {
    height: 100%; border-radius: 100px;
    background: linear-gradient(90deg, var(--sage), var(--gold));
    transition: width 0.3s ease;
  }
  .cook-progress-label {
    font-family: 'Space Mono', monospace; font-size: 0.68rem;
    color: var(--smoke); white-space: nowrap;
  }
  .ingredient-item.checkable, .step-item.checkable { cursor: pointer; border-radius: 8px; transition: background 0.15s; }
  .ingredient-item.checkable:hover, .step-item.checkable:hover { background: var(--warm-white); }
  .ingredient-item.checked, .step-item.checked { opacity: 0.45; }
  .ingredient-item.checked span:not(.check-box), .step-item.checked .step-text { text-decoration: line-through; }
  .step-item.checked .step-num { background: var(--sage); }
  .check-box {
    width: 18px; height: 18px; min-width: 18px; border-radius: 5px;
    border: 1.5px solid var(--ash); background: var(--surface);
    display: inline-flex; align-items: center; justify-content: center;
    font-size: 0.7rem; color: white; margin-top: 2px; transition: all 0.15s;
  }
  .check-box.on { background: var(--sage); border-color: var(--sage); }
  .ingredient-item.checkable:focus-visible,
  .step-item.checkable:focus-visible {
    outline: 3px solid var(--focus); outline-offset: 3px;
  }

  /* ── Discover diet tags ── */
  .recipe-card-tags { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-top: 0.5rem; }
  .recipe-card-diet-tag {
    font-family: 'Space Mono', monospace; font-size: 0.6rem;
    text-transform: uppercase; letter-spacing: 0.05em;
    padding: 0.15rem 0.5rem; border-radius: 100px;
    background: var(--warm-white); color: var(--sage);
    border: 1px solid var(--border);
  }

  .error-message {
    margin-top: 1rem; padding: 0.75rem 1rem;
    background: var(--error-bg); border: 1px solid var(--error-border);
    border-radius: 10px; font-size: 0.85rem; color: var(--error);
  }
  .saved-card { cursor: default; }

  @media (max-width: 640px) {
    .nav {
      height: auto; min-height: 104px; padding: 0.45rem 0.75rem 0.5rem;
      flex-wrap: wrap; align-content: center; gap: 0.25rem;
    }
    .nav-logo { width: 100%; justify-content: center; font-size: 1.35rem; line-height: 1.1; }
    .nav-tabs {
      width: 100%; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.15rem; overflow: visible;
    }
    .nav-tab {
      min-width: 0; min-height: 44px; padding: 0.4rem 0.15rem;
      font-size: 0.72rem; white-space: nowrap;
    }
    .page { padding-top: 120px; }
    .hero { padding: 2.5rem 1.25rem 2rem; }
    .hero-title { font-size: 2.85rem; }
    .hero-sub { font-size: 1rem; margin-bottom: 1rem; }
    .gen-card {
      margin: 0 0.75rem 2rem; padding: 1.25rem;
      border-radius: 16px;
    }
    .quick-add,
    .filter-chip,
    .diet-chip,
    .improve-chip,
    .btn-action,
    .cook-mode-toggle,
    .picker-chip,
    .btn-picker-confirm,
    .pantry-status-toggle,
    .pantry-edit-save,
    .pantry-edit-cancel,
    .pantry-icon-btn {
      min-height: 44px;
    }
    .quick-add { padding-inline: 0.8rem; }
    .chip-x, .serving-btn, .pantry-icon-btn {
      width: 44px; height: 44px; min-width: 44px;
    }
    .select-field { font-size: 0.9rem; }
    .discover-page, .pantry-page, .planner-page, .saved-page { padding: 1.5rem 1rem; }
    .recipe-header, .recipe-body { padding: 1.25rem; }
    .recipe-meta { gap: 1.25rem; }
    .nutrition-grid { grid-template-columns: repeat(2, 1fr); }
    .filter-bar { padding: 0.85rem; }
    .toast-container { left: 1rem; right: 1rem; bottom: 1rem; }
    .toast { width: 100%; justify-content: center; }
    .planner-picker-panel { position: fixed; left: 1rem; right: 1rem; top: auto; bottom: 1rem; min-width: 0; }
  }

  /* Editorial generator — selected Product Design direction */
  .generator-page {
    position: relative;
    padding-top: 64px;
    overflow: hidden;
    background: var(--cream);
  }
  .editorial-hero {
    position: relative;
    width: min(100%, 1440px);
    min-height: 866px;
    margin: 0 auto;
    padding: 84px 52px 0;
  }
  .editorial-copy {
    position: relative;
    z-index: 5;
    width: min(47vw, 680px);
  }
  .editorial-eyebrow {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 30px;
    color: var(--terra);
    font-family: 'Space Mono', monospace;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.13em;
    text-transform: uppercase;
  }
  .editorial-eyebrow-line {
    width: 48px;
    height: 1px;
    background: color-mix(in srgb, var(--terra) 52%, transparent);
  }
  .editorial-title {
    max-width: 670px;
    color: #281814;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: clamp(5rem, 7.95vw, 7.2rem);
    font-weight: 300;
    letter-spacing: -0.045em;
    line-height: 0.89;
    text-wrap: balance;
  }
  .editorial-title em {
    display: block;
    margin-top: 0;
    color: var(--terra);
    font-size: 1.03em;
    font-weight: 400;
    letter-spacing: -0.05em;
    line-height: 0.74;
  }
  .editorial-subtitle {
    max-width: 520px;
    margin-top: 16px;
    color: #765f55;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.72;
  }
  .editorial-visual {
    position: absolute;
    z-index: 1;
    top: 34px;
    right: -48px;
    width: 670px;
    height: 660px;
  }
  .editorial-slice {
    position: absolute;
    right: 0;
    width: 610px;
    overflow: hidden;
  }
  .editorial-slice img {
    position: absolute;
    right: 0;
    width: 650px;
    max-width: none;
    height: 650px;
    object-fit: cover;
  }
  .editorial-slice-one {
    top: 0;
    height: 238px;
    clip-path: polygon(9% 0, 100% 0, 100% 100%, 0 100%);
  }
  .editorial-slice-one img { top: 0; }
  .editorial-slice-two {
    top: 248px;
    height: 220px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 3% 100%);
  }
  .editorial-slice-two img { top: -248px; }
  .editorial-slice-three {
    top: 478px;
    height: 182px;
    clip-path: polygon(3% 0, 100% 0, 100% 100%, 0 100%);
  }
  .editorial-slice-three img { top: -478px; }
  .ingredient-note {
    --note-color: var(--sage);
    position: absolute;
    z-index: 4;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--note-color);
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.02rem;
    font-weight: 600;
    animation: ingredientFloat 5.8s ease-in-out infinite;
  }
  .ingredient-note::after {
    content: '';
    order: 1;
    width: 88px;
    border-top: 1px dashed color-mix(in srgb, var(--note-color) 68%, transparent);
  }
  .ingredient-note img {
    order: 2;
    width: 68px;
    height: 68px;
    border-radius: 50%;
    object-fit: cover;
    mix-blend-mode: multiply;
  }
  .ingredient-note-chicken { top: 168px; left: -130px; }
  .ingredient-note-garlic {
    --note-color: #9d674b;
    top: 267px;
    left: -148px;
    animation-delay: -1.3s;
  }
  .ingredient-note-tomato {
    --note-color: var(--terra);
    top: 367px;
    left: -185px;
    animation-delay: -2.4s;
  }
  .ingredient-note-lemon {
    --note-color: #c58a00;
    top: 468px;
    left: -210px;
    animation-delay: -3.5s;
  }
  @keyframes ingredientFloat {
    0%, 100% { transform: translate3d(0, 0, 0); }
    50% { transform: translate3d(0, -7px, 0); }
  }
  .editorial-composer {
    position: absolute;
    z-index: 10;
    left: 52px;
    right: 52px;
    bottom: 26px;
    min-height: 178px;
    padding: 22px 34px 18px;
    border: 1px solid rgba(92, 69, 58, 0.14);
    border-radius: 17px;
    background: rgba(255, 255, 255, 0.96);
    box-shadow: 0 18px 48px rgba(67, 41, 29, 0.13);
    backdrop-filter: blur(14px);
  }
  .editorial-input-row {
    display: grid;
    grid-template-columns: minmax(240px, 1.15fr) minmax(360px, 2fr) minmax(210px, 1.05fr) minmax(164px, 0.8fr);
    align-items: center;
    gap: 16px;
  }
  .editorial-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }
  .editorial-input-icon {
    position: absolute;
    left: 17px;
    color: #9e8c83;
    pointer-events: none;
  }
  .editorial-input {
    width: 100%;
    min-height: 56px;
    padding: 0 16px 0 48px;
    border: 1px solid rgba(92, 69, 58, 0.17);
    border-radius: 10px;
    background: #fffdf9;
    color: var(--bark);
    font-size: 0.92rem;
    outline: none;
  }
  .editorial-input::placeholder { color: #9e8c83; }
  .editorial-input:focus {
    border-color: var(--terra);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--terra) 14%, transparent);
  }
  .editorial-add {
    position: absolute;
    right: 6px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 8px;
    background: transparent;
    color: var(--terra);
    cursor: pointer;
  }
  .editorial-add:hover { background: var(--warm-white); }
  .editorial-chip-list {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .editorial-chip-list::-webkit-scrollbar { display: none; }
  .editorial-chip {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    gap: 5px;
    min-height: 42px;
    padding: 0 8px 0 14px;
    border: 1px solid rgba(92, 69, 58, 0.17);
    border-radius: 999px;
    background: #fffdf9;
    color: #43302a;
    font-size: 0.82rem;
    font-weight: 500;
  }
  .editorial-chip-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: #8c746a;
    cursor: pointer;
  }
  .editorial-chip-remove:hover { background: var(--warm-white); color: var(--terra); }
  .editorial-generate,
  .editorial-surprise {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 56px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 0.92rem;
    font-weight: 600;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
  }
  .editorial-generate {
    border: 1px solid var(--terra);
    background: var(--terra);
    color: white;
  }
  .editorial-generate:hover:not(:disabled) {
    background: #b85224;
    box-shadow: 0 10px 24px rgba(196, 98, 45, 0.25);
    transform: translateY(-2px);
  }
  .editorial-surprise {
    border: 1px solid rgba(92, 69, 58, 0.2);
    background: #fffdf9;
    color: #4b3730;
  }
  .editorial-surprise:hover:not(:disabled) {
    border-color: var(--gold);
    background: #fffaf0;
    transform: translateY(-2px);
  }
  .editorial-generate:disabled,
  .editorial-surprise:disabled { cursor: not-allowed; opacity: 0.58; }
  .editorial-composer-divider {
    height: 1px;
    margin: 17px 0 12px;
    background: rgba(92, 69, 58, 0.12);
  }
  .editorial-preferences {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: center;
  }
  .editorial-pref {
    position: relative;
    display: grid;
    grid-template-columns: 30px minmax(72px, auto) minmax(90px, 1fr);
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 34px;
    color: #46332c;
  }
  .editorial-pref + .editorial-pref { border-left: 1px solid rgba(92, 69, 58, 0.12); }
  .editorial-pref-icon { color: #7d665d; }
  .editorial-pref-label {
    color: #765f55;
    font-size: 0.78rem;
  }
  .editorial-pref select {
    min-height: 44px;
    padding: 0 30px 0 0;
    border: 0;
    background: transparent;
    color: #382721;
    font-size: 0.82rem;
    font-weight: 600;
    outline: 0;
    cursor: pointer;
    appearance: auto;
  }
  .editorial-pref select:focus-visible {
    outline: 3px solid var(--focus);
    outline-offset: 3px;
  }
  .editorial-pref-button {
    grid-template-columns: 30px 1fr 20px;
    width: 100%;
    border: 0;
    background: transparent;
    text-align: left;
    cursor: pointer;
  }
  .editorial-pref-copy {
    display: flex;
    align-items: baseline;
    gap: 12px;
  }
  .editorial-pref-value {
    color: #382721;
    font-size: 0.82rem;
    font-weight: 600;
  }
  .editorial-options {
    width: min(calc(100% - 104px), 1336px);
    margin: 12px auto 38px;
    padding: 28px 34px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: var(--surface);
    box-shadow: var(--shadow);
    animation: fadeUp 0.24s ease;
  }
  .editorial-options-title {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 1.4rem;
  }
  .editorial-options-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 14px;
    margin-bottom: 22px;
  }
  .editorial-options .select-field {
    appearance: auto;
    background-image: none;
    background-color: var(--cream);
  }
  .editorial-promise {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    min-height: 76px;
    padding: 12px 24px 22px;
    color: #4c3931;
    font-size: 0.9rem;
  }
  .editorial-promise svg { color: var(--terra); }
  .editorial-footer-art {
    position: absolute;
    z-index: 1;
    top: 890px;
    left: 0;
    right: 0;
    height: 123px;
    overflow: hidden;
    pointer-events: none;
  }
  .editorial-footer-art img {
    position: absolute;
    max-width: none;
    height: auto;
    mix-blend-mode: multiply;
  }
  .editorial-footer-herbs {
    bottom: -88px;
    left: 42px;
    width: 420px;
  }
  .editorial-footer-linen {
    right: -70px;
    bottom: -95px;
    width: 520px;
  }
  .generator-results {
    padding: 0 1rem;
  }

  @media (max-width: 1180px) {
    .editorial-hero { padding-inline: 34px; }
    .editorial-copy { width: min(52vw, 610px); }
    .editorial-title { font-size: clamp(4.2rem, 7vw, 5.4rem); }
    .editorial-visual { right: -165px; opacity: 0.94; }
    .ingredient-note { display: none; }
    .editorial-composer { left: 34px; right: 34px; }
    .editorial-input-row {
      grid-template-columns: minmax(210px, 1.2fr) minmax(300px, 1.7fr) minmax(190px, 1fr);
    }
    .editorial-surprise { grid-column: 3; }
    .editorial-generate { grid-column: 3; grid-row: 1; }
    .editorial-input-row > .editorial-surprise { display: none; }
    .editorial-pref { padding-inline: 18px; }
  }

  @media (max-width: 820px) {
    .generator-page { padding-top: 104px; }
    .editorial-hero {
      min-height: 1140px;
      padding: 54px 24px 0;
    }
    .editorial-copy { width: 100%; }
    .editorial-title {
      max-width: 620px;
      font-size: clamp(4rem, 12vw, 5.4rem);
    }
    .editorial-subtitle { max-width: 480px; }
    .editorial-visual {
      top: 475px;
      right: -72px;
      width: 600px;
      height: 500px;
    }
    .editorial-slice { width: 550px; }
    .editorial-slice img { width: 570px; height: 570px; }
    .editorial-slice-one { height: 178px; }
    .editorial-slice-two { top: 188px; height: 150px; }
    .editorial-slice-two img { top: -188px; }
    .editorial-slice-three { top: 348px; height: 152px; }
    .editorial-slice-three img { top: -348px; }
    .editorial-composer {
      left: 24px;
      right: 24px;
      bottom: 18px;
      padding: 22px;
    }
    .editorial-input-row {
      grid-template-columns: 1fr 1fr;
    }
    .editorial-input-wrap,
    .editorial-chip-list { grid-column: 1 / -1; }
    .editorial-generate,
    .editorial-surprise { grid-column: auto; grid-row: auto; }
    .editorial-input-row > .editorial-surprise { display: inline-flex; }
    .editorial-preferences { grid-template-columns: 1fr; }
    .editorial-pref { padding: 6px 0; }
    .editorial-pref + .editorial-pref {
      border-top: 1px solid rgba(92, 69, 58, 0.12);
      border-left: 0;
    }
    .editorial-options {
      width: calc(100% - 48px);
      padding: 24px;
    }
    .editorial-footer-art { display: none; }
  }

  @media (max-width: 560px) {
    .generator-page { padding-top: 104px; }
    .editorial-hero {
      display: flex;
      min-height: 0;
      flex-direction: column;
      padding: 42px 18px 0;
    }
    .editorial-copy { order: 1; }
    .editorial-eyebrow { gap: 10px; margin-bottom: 22px; font-size: 0.62rem; }
    .editorial-eyebrow-line { width: 30px; }
    .editorial-title { font-size: clamp(3.25rem, 15.5vw, 4.35rem); }
    .editorial-subtitle { margin-top: 18px; font-size: 0.94rem; }
    .editorial-visual {
      position: relative;
      top: auto;
      right: auto;
      order: 3;
      align-self: center;
      width: 560px;
      height: 500px;
      margin: 28px -85px -76px 0;
      transform: scale(0.78);
      transform-origin: top center;
    }
    .editorial-composer {
      position: relative;
      left: auto;
      right: auto;
      bottom: auto;
      order: 2;
      width: 100%;
      margin-top: 28px;
      padding: 18px 16px;
    }
    .editorial-input-row { grid-template-columns: 1fr; }
    .editorial-input-wrap,
    .editorial-chip-list,
    .editorial-generate,
    .editorial-surprise { grid-column: 1; }
    .editorial-chip-list { padding-bottom: 4px; }
    .editorial-generate,
    .editorial-surprise { width: 100%; }
    .editorial-options {
      width: calc(100% - 28px);
      padding: 20px 16px;
    }
    .editorial-options-grid { grid-template-columns: 1fr; }
    .editorial-promise { align-items: flex-start; text-align: left; }
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      scroll-behavior: auto !important;
      transition-duration: 0.01ms !important;
    }
  }

  @media (forced-colors: active) {
    button:focus-visible,
    input:focus-visible,
    select:focus-visible,
    textarea:focus-visible { outline: 3px solid Highlight; }
  }
`;

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
interface Ingredient { amount: string; name: string; }
interface Nutrition { calories: number; protein: number; carbs: number; fat: number; }
interface Recipe {
  name: string; cuisine: string; description: string;
  time: string; difficulty: string; servings: number;
  ingredients: Ingredient[]; steps: string[];
  nutrition: Nutrition; tips?: string;
  emoji?: string; calories?: number; rating?: number;
}

const STORAGE_KEYS = {
  saved: "culina.savedRecipes.v1",
  pantry: "culina.pantryItems.v1",
  mealPlan: "culina.mealPlan.v1",
};

// ─── API ─────────────────────────────────────────────────────────────────────
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

function parseRecipe(text: string): Recipe {
  const parsed: unknown = JSON.parse(extractJson(text));

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

async function callClaude(prompt: string): Promise<Recipe> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt })
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = isRecord(errorBody) && typeof errorBody.error === "string"
      ? errorBody.error
      : `API error: ${res.status}`;
    throw new Error(message);
  }
  const data = await res.json();
  const text = (data.content as Array<{type:string;text?:string}>)
    ?.map(b => b.text || "").join("") || "";
  return parseRecipe(text);
}

function usePersistentState<T>(key: string, fallback: T) {
  // Server and first client render both use `fallback` so SSR hydration matches;
  // stored data is loaded after mount, then changes are persisted.
  const fallbackRef = useRef(fallback);
  const [value, setValue] = useState<T>(fallbackRef.current);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        const baseline = fallbackRef.current;
        const compatible = Array.isArray(baseline)
          ? Array.isArray(parsed)
          : typeof baseline === "object" && baseline !== null
            ? isRecord(parsed)
            : typeof parsed === typeof baseline;

        if (compatible) setValue(parsed as T);
      }
    } catch {
      // Storage may be unavailable in private mode or restricted browsers.
    } finally {
      setHydrated(true);
    }
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage may be unavailable in private mode or restricted browsers.
    }
  }, [hydrated, key, value]);

  return [value, setValue] as const;
}

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

  useEffect(() => {
    setServings(recipe.servings || 2);
    setCheckedIng(new Set());
    setCheckedSteps(new Set());
    setCookMode(false);
  }, [recipe.name, recipe.servings]);

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

  useEffect(() => {
    if (initialIngredients && initialIngredients.length > 0) setIngredients(initialIngredients);
  }, [initialIngredients]);
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
      setError(`Generation failed: ${msg}. If this persists, check your API key in .env.local.`);
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
              <Image src="/images/editorial/chicken-hero.png" alt="" width={650} height={650} priority />
            </div>
            <div className="editorial-slice editorial-slice-two" aria-hidden="true">
              <Image src="/images/editorial/chicken-hero.png" alt="" width={650} height={650} priority />
            </div>
            <div className="editorial-slice editorial-slice-three" aria-hidden="true">
              <Image src="/images/editorial/chicken-hero.png" alt="" width={650} height={650} priority />
            </div>

            <div className="ingredient-note ingredient-note-chicken">
              <span>chicken</span>
              <Image src="/images/editorial/basil.png" alt="" width={68} height={68} />
            </div>
            <div className="ingredient-note ingredient-note-garlic">
              <span>garlic</span>
              <Image src="/images/editorial/garlic.png" alt="" width={68} height={68} />
            </div>
            <div className="ingredient-note ingredient-note-tomato">
              <span>tomatoes</span>
              <Image src="/images/editorial/tomato.png" alt="" width={68} height={68} />
            </div>
            <div className="ingredient-note ingredient-note-lemon">
              <span>lemon</span>
              <Image src="/images/editorial/lemon.png" alt="" width={68} height={68} />
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
          <Image className="editorial-footer-herbs" src="/images/editorial/herb-scatter.png" alt="" width={420} height={280} />
          <Image className="editorial-footer-linen" src="/images/editorial/linen.png" alt="" width={520} height={360} />
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
            <RecipeOutput recipe={recipe} saved={savedIds.has(recipe.name)} onSave={()=>onSave(recipe)} onImprove={improve} onAddToPlanner={(day,meal)=>onAddToPlanner(recipe,day,meal)} onToast={onToast}/>
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
          <span style={{fontSize:"0.65rem",color:"var(--smoke)",marginRight:"0.5rem",fontFamily:"Space Mono,monospace",textTransform:"uppercase",letterSpacing:"0.08em"}}>Quick add:</span>
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
          <div style={{fontSize:"0.65rem",fontFamily:"Space Mono,monospace",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--smoke)",marginBottom:"0.75rem"}}>Preferences</div>
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
            <span style={{fontSize:"0.65rem",fontFamily:"Space Mono,monospace",textTransform:"uppercase",letterSpacing:"0.08em",color:"var(--smoke)"}}>
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
        <RecipeOutput recipe={recipe} saved={savedIds.has(recipe.name)} onSave={()=>onSave(recipe)} onImprove={improve} onAddToPlanner={(day,meal)=>onAddToPlanner(recipe,day,meal)} onToast={onToast}/>
      )}
    </div>
  );
}

// ─── DiscoverPage ─────────────────────────────────────────────────────────────
type SampleRecipe = typeof SAMPLE_RECIPES[0];

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
    <div className="page">
      <div className="discover-page">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Recipe Collection</div>
          <h1 className="discover-title">Discover <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>exceptional</em> dishes</h1>
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
    <div className="page">
      <div className="pantry-page">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Smart Pantry</div>
          <h1 className="discover-title">Your <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>pantry</em></h1>
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
                      <span style={{fontSize:"0.78rem",color:"var(--smoke)",fontFamily:"Space Mono,monospace"}}>{item.qty}</span>
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
                  <span style={{fontSize:"0.75rem",color:"var(--sage)",fontFamily:"Space Mono,monospace"}}>pantry-friendly</span>
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
    <div className="page">
      <div className="planner-page">
        <div style={{marginBottom:"1.5rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>AI Meal Planner</div>
          <h1 className="discover-title">Weekly <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>meal plan</em></h1>
        </div>
        <div style={{display:"flex",gap:"1rem",marginBottom:"1.5rem",flexWrap:"wrap",alignItems:"center"}}>
          {[["Target","1800 kcal/day"],["Protein","120g"],["Carbs","200g"],["Fat","65g"]].map(([label,val])=>(
            <div key={label} style={{background:"var(--surface)",border:"1px solid var(--border)",borderRadius:"12px",padding:"0.75rem 1.25rem",textAlign:"center"}}>
              <div style={{fontFamily:"Space Mono,monospace",fontSize:"0.65rem",textTransform:"uppercase",letterSpacing:"0.1em",color:"var(--smoke)",marginBottom:"0.2rem"}}>{label}</div>
              <div style={{fontFamily:"Cormorant Garamond,serif",fontSize:"1.3rem",fontWeight:600,color:"var(--bark)"}}>{val}</div>
            </div>
          ))}
          <button type="button" onClick={onRegenerate} style={{minHeight:"44px",padding:"0.75rem 1.25rem",borderRadius:"12px",background:"var(--terra)",color:"white",border:"none",cursor:"pointer",fontFamily:"DM Sans,sans-serif",fontSize:"0.9rem",fontWeight:500,marginLeft:"auto"}}>✦ Regenerate Plan</button>
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
    <div className="page">
      <div className="saved-page">
        <div style={{marginBottom:"2rem"}}>
          <div className="hero-eyebrow" style={{justifyContent:"flex-start",marginBottom:"0.5rem"}}>Your Collection</div>
          <h1 className="discover-title">Saved <em style={{fontFamily:"Cormorant Garamond,serif",fontStyle:"italic",color:"var(--terra)"}}>recipes</em></h1>
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
  const [saved, setSaved] = usePersistentState<Recipe[]>(STORAGE_KEYS.saved, []);
  const [toasts, setToasts] = useState<Array<{id:number;msg:string;icon:string}>>([]);
  const [pantryItems, setPantryItems] = usePersistentState<PantryItem[]>(STORAGE_KEYS.pantry, PANTRY_ITEMS);
  const [pendingIngredients, setPendingIngredients] = useState<string[]>([]);
  const [mealPlan, setMealPlan] = usePersistentState<MealPlan>(STORAGE_KEYS.mealPlan, MEAL_PLAN);
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
      <style dangerouslySetInnerHTML={{ __html: FONTS + CSS }} />
      <div className="app">
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <nav className="nav" aria-label="Primary">
          <div className="nav-logo">
            <Diamond className="nav-logo-mark" size={19} weight="duotone" aria-hidden="true" />
            <span>Culinaria</span>
          </div>
          <div className="nav-tabs">
            {[{id:"generate",label:"Generate"},{id:"discover",label:"Discover"},{id:"pantry",label:"Pantry"},{id:"planner",label:"Planner"},{id:"saved",label:"Saved",badge:saved.length||null}].map(t=>(
              <button type="button" key={t.id} aria-current={tab===t.id?"page":undefined} className={`nav-tab${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)}>
                {t.label}{t.badge?<span className="nav-badge">{t.badge}</span>:null}
              </button>
            ))}
          </div>
        </nav>
        <main id="main-content" tabIndex={-1}>
          {tab==="generate" && <GeneratorPage onSave={handleSave} savedIds={savedIds} initialIngredients={pendingIngredients} onAddToPlanner={handleAddToPlanner} onToast={addToast}/>}
          {tab==="discover" && <DiscoverPage onSave={handleSave} savedIds={savedIds} onAddToPlanner={handleAddToPlanner} onToast={addToast}/>}
          {tab==="pantry" && <PantryPage items={pantryItems} setItems={setPantryItems} onGenerateFromPantry={()=>{setPendingIngredients(pantryItems.map(i=>i.name));setTab("generate");}}/>}
          {tab==="planner" && <PlannerPage mealPlan={mealPlan} onRegenerate={handleRegeneratePlan}/>}
          {tab==="saved" && <SavedPage saved={saved} onRemove={handleSave}/>}
        </main>
        <Toast toasts={toasts}/>
      </div>
    </>
  );
}
