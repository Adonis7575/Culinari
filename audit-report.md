# Culina remediation audit

Date: 2026-08-03

Scope: dependency security, Next.js/React migration, Claude generation, accessibility, font and image delivery, theming, motion, maintainability, persistence, and rendered behavior at 390×844 and 1440×900.

## Final health score

| Dimension | Score | Verified state |
| --- | ---: | --- |
| Accessibility | 4/4 | Semantic landmarks, labels, focus states, live regions, modal handling, reduced-motion support, forced-colors support, and 44 px or larger visible controls at both audited viewports. |
| Performance | 4/4 | Editorial sources reduced from 9.74 MiB to 591 KiB, images served through Next Image, fonts self-hosted by `next/font`, and broad transitions removed. |
| Theming | 4/4 | The active palette and component states use semantic OKLCH tokens; no stray hex, RGB, or RGBA literals remain in the application styles. The warm light theme matches the documented kitchen-counter use case. |
| Responsive | 4/4 | No horizontal overflow at 390 px or 1440 px, all five views retain one clear page heading, and navigation and interaction targets remain usable. |
| Anti-patterns | 3/4 | Styling, persistence, and AI parsing/API logic are now isolated from the main component. Page views remain co-located and can be split further if the feature surface grows. |

**Overall: 19/20 — release-ready, with no open P0, P1, or P2 findings.**

## Completed remediation

### Dependency and framework security

- Upgraded Next.js 14.2.35 → 16.2.12 and React/React DOM 18 → 19.2.8.
- Upgraded `@anthropic-ai/sdk` 0.27.x → 0.115.0, removing the vulnerable `form-data` chain.
- Applied patched PostCSS 8.5.25 and Sharp 0.35.0 overrides while retaining Next Image functionality.
- Migrated removed `next lint` behavior to ESLint flat config with compatible ESLint 9.39.5.
- Configured `turbopack.root` in `next.config.js:3` so Next 16 resolves this project rather than the unrelated parent lockfile.
- Both `npm audit --omit=dev` and the full `npm audit` now report zero vulnerabilities.

### Accessibility and responsive behavior

- Increased `.editorial-chip-remove` from 30×30 px to 44×44 px at `components/RecipePlatform.css:1180`.
- Browser measurement found no visible controls below 44 px at either 390×844 or 1440×900.
- Existing skip-link, focus outline, semantic heading, live-region, modal focus, reduced-motion, and forced-colors behavior remains intact.
- All views render without horizontal overflow at both audited widths.

### Image and font delivery

- Converted all seven editorial PNG sources to WebP and updated every application reference.
- Editorial source assets now total 605,372 bytes (591.2 KiB), down from 10,209,560 bytes (9.74 MiB), approximately 94% smaller.
- Verified each WebP with Sharp and verified browser delivery through Next Image, including successful decoded hero imagery.
- Replaced the render-blocking Google Fonts CSS `@import` with optimized `next/font` declarations in `app/layout.tsx:2`.
- Added `npm run optimize:images` for repeatable conversion of future editorial PNGs.

### Theming and motion

- Moved the design system into `components/RecipePlatform.css` instead of injecting a 1,400-line string at runtime.
- Converted the palette to semantic OKLCH tokens and replaced scattered literal colors with named surface, text, state, border, overlay, and shadow roles.
- Replaced every `transition: all` declaration with explicit color, background, border, shadow, and transform transitions.
- Retained the distinct Anime.js ambience on Discover, Pantry, Planner, and Saved; sampled transforms changed over time and reduced-motion remains respected at `components/RecipePlatform.css:1479`.

### Maintainability and React 19 behavior

- Reduced `components/RecipePlatform.tsx` from roughly 3,100 lines to 1,484 lines.
- Extracted AI response parsing and the browser API client to `lib/recipe-api.ts`.
- Extracted persistence to `hooks/usePersistentState.ts`, using `useSyncExternalStore` for hydration-safe, same-tab, cross-tab, and restricted-storage behavior.
- Replaced effect-driven recipe resets with keyed recipe mounts and removed the redundant ingredient synchronization effect.
- Verified a temporary pantry item persisted across a full reload, then removed the test item.

### Claude Opus 5 generation

- The server default remains the official `claude-opus-5` ID at `app/api/claude/route.ts:6`.
- Increased `max_tokens` from 1,500 to 4,096 at `app/api/claude/route.ts:76` after the full UI test exposed truncated recipe JSON.
- Added a concise retryable error for incomplete or malformed model output.
- A full browser generation completed successfully and rendered 14 ingredients, 8 steps, and 4 nutrition values without console errors.

## Verification results

| Check | Result |
| --- | --- |
| `npm run lint` | Pass |
| `npm run typecheck` | Pass |
| `npm run build` | Pass on Next 16.2.12 with Turbopack |
| `npm audit --omit=dev` | Pass — 0 vulnerabilities |
| `npm audit` | Pass — 0 vulnerabilities |
| Local page and WebP requests | Pass — HTTP 200 |
| Claude transport smoke test | Pass — `claude-opus-5`, `end_turn`, `OK` |
| Full recipe-generation UI | Pass — complete parsed recipe rendered |
| Pantry persistence/reload | Pass |
| Mobile and desktop overflow | Pass — none |
| Visible control target size | Pass — no targets below 44 px |
| Dynamic secondary backgrounds | Pass — all four present and moving |
| Browser console | Pass — no warnings or errors |

## Future enhancement

- `RecipePlatform.tsx` still co-locates the five page views. Splitting those views is optional at the current scale, but should be the next structural step before adding more major features.
