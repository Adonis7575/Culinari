# Culina product audit

Date: 2026-08-03

Scope: Next.js application source, production build, local Claude API route, dependency tree, and rendered UI at 390×844 and 1440×900.

## Health score

| Dimension | Score | Summary |
| --- | ---: | --- |
| Accessibility | 3/4 | Strong semantics, labels, focus treatment, live regions, dialog handling, reduced-motion support, and forced-colors support; one repeated touch-target issue remains. |
| Performance | 2/4 | The 142 kB first-load bundle is reasonable, but the editorial image sources total 9.74 MiB, Google Fonts load through a CSS `@import`, and decorative motion runs continuously. |
| Theming | 2/4 | Core colors are tokenized and forced-colors is handled, but many later rules and inline styles bypass the tokens and there is no alternate color-scheme implementation. |
| Responsive | 3/4 | No horizontal overflow at either audited viewport, sensible breakpoints, and 44 px navigation targets; the ingredient-removal controls are the main mobile exception. |
| Anti-patterns | 3/4 | The visual language is distinctive and consistent, but one very large component owns most application state, markup, and a long CSS string, and many rules use `transition: all`. |

**Overall: 13/20 — functional and polished, with focused security, performance, and maintainability work recommended.**

No P0 blockers were found.

## Findings

### P1 — Production dependencies contain three high-severity advisories

- Evidence: `npm audit --omit=dev` reports 3 high, 0 critical vulnerabilities across 62 production dependencies.
- Affected packages: `next@14.2.35`, its `postcss@8.4.31` dependency, and `form-data@4.0.5` through `@anthropic-ai/sdk@0.27.3` → `@types/node-fetch`.
- Impact: the advisory set includes denial-of-service, XSS, request-smuggling, cache-poisoning, and disclosure classes. Exact exploitability varies with the features Culina uses, but the production tree is not currently clean.
- Recommendation: plan a controlled Next.js upgrade (npm currently proposes `next@16.2.12`, a major update), update the Anthropic SDK/transitive `form-data`, rerun the full UI/API regression suite, and require a clean production audit before release.

### P2 — Ingredient removal controls miss the 44 px product target

- Evidence: the four visible remove buttons measure 30×30 px at both audited viewport sizes. The style is defined by `.editorial-chip-remove` in `components/RecipePlatform.tsx:1184`.
- Impact: small targets are harder to use while cooking, on touch devices, or for users with motor impairments.
- Recommendation: preserve the visual icon size while expanding the interactive box to at least 44×44 px, including spacing that prevents adjacent target overlap.

### P2 — Image and font delivery can delay the first useful render

- Evidence: the seven files in `public/images/editorial` total 9.74 MiB; `chicken-hero.png` alone is 2.71 MiB. Next Image optimizes delivered variants, but large sources still increase build/storage work and can increase decode cost. The component also loads three Google Font families with a CSS `@import` at `components/RecipePlatform.tsx:23`.
- Impact: slower cold loads and less predictable font rendering on constrained networks or devices.
- Recommendation: losslessly compress or convert the editorial art to modern formats, remove unused source resolution, and migrate font loading to `next/font` with only the required weights.

### P2 — The primary component is carrying too many responsibilities

- Evidence: `components/RecipePlatform.tsx` contains roughly 3,100 physical source lines and combines global styling, animation setup, API orchestration, persistence, modals, navigation, and every page view.
- Impact: changes have a large regression surface, page-level code cannot be isolated easily, and design tokens are harder to enforce.
- Recommendation: extract the theme/styles, shared controls, persistence hooks, API client, and each top-level page into focused modules. Preserve the existing user experience during the split.

### P3 — Theme tokens are only partially enforced

- Evidence: the root palette is defined at `components/RecipePlatform.tsx:30`, while numerous later rules use literal hex and RGB values, beginning prominently around `components/RecipePlatform.tsx:984`; several JSX elements also carry inline presentation styles.
- Impact: palette changes, contrast tuning, and any future dark theme require scattered edits.
- Recommendation: extend the existing semantic token set for text, surfaces, borders, states, and overlays, then replace literals incrementally.

### P3 — Broad transitions animate more properties than needed

- Evidence: repeated `transition: all` declarations appear throughout `components/RecipePlatform.tsx`, including lines 104, 323, 375, 502, 523, 548, and 557.
- Impact: unrelated property changes can animate unexpectedly and create avoidable style/compositing work.
- Recommendation: list only the intended properties, typically `color`, `background-color`, `border-color`, `box-shadow`, `opacity`, and `transform`.

## Verified strengths

- Every audited page exposes one `h1` and one `main`; visible controls have accessible names.
- A skip link, strong `:focus-visible` outline, polite status regions, alert regions, and a focus-trapped modal are present.
- `prefers-reduced-motion` and forced-colors overrides are implemented at `components/RecipePlatform.tsx:1483` and `components/RecipePlatform.tsx:1493`.
- Generate, Discover, Pantry, Planner, and Saved render without horizontal overflow at 390 px and 1440 px.
- Discover, Pantry, Planner, and Saved each render a distinct five-layer ambience; sampled Anime.js transforms changed over time, confirming live motion rather than a static decoration.
- The audited browser session produced no console warnings or errors.
- The Claude route keeps the API key server-side, validates JSON and prompt length, and enforces a 45-second timeout.

## Verification results

| Check | Result |
| --- | --- |
| `npm run lint` | Pass — no warnings or errors |
| `npm run build` | Pass — production build and type checks completed |
| First-load JavaScript | 142 kB for `/` |
| Local page request | Pass — HTTP 200 |
| Claude API smoke test | Pass — response model `claude-opus-5`, stop reason `end_turn`, text `OK` |
| Browser console | Pass — no warnings or errors |
| Responsive overflow | Pass — none at 390×844 or 1440×900 |
| `npm audit --omit=dev` | Needs action — 3 high, 0 critical |

## Recommended order of work

1. Resolve the production dependency advisories in a dedicated framework/SDK upgrade.
2. Expand the ingredient-removal targets to 44×44 px.
3. Optimize editorial images and migrate Google Fonts to `next/font`.
4. Split `RecipePlatform.tsx` into page, service, hook, and design-system modules.
5. Finish semantic token adoption and narrow broad transitions.
