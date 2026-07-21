# Current status

## Implemented
- Compose-based FE/BE demo with hot reload
- Deterministic mock movements (`seed=42`)
- Dashboard KPIs + two charts from `GET /api/metrics`
- Backend analytics routes beyond what the UI uses
- Backend pytest suite; frontend utils Vitest coverage
- Agent rules under `.agents/rules/` (Phase 3)
- Loaded `accessibility`, `vercel-react-best-practices`, and `performance` skills under `.agents/skills/`
- Accessible loading/error announcements, semantic chart headings, decorative icon handling, and screen-reader chart tables
- Descriptive Vite page metadata and a system-font stack
- Lazy-loaded chart modules that keep every production chunk below 500 kB
- Project skill `.skills/financial-dashboard-data-integrity/SKILL.md`
- Dashboard period derived from the API movement date range

## Known gaps
- UI does not use `/summary`, `/facets`, `/alerts`, `/comparison`, `/b2b`, `/b2c`
- Unused `frontend/src/lib/mock-data.ts`
- Open CORS suitable for demo only

## Next priorities
1. Wire filters/facets from existing backend endpoints
2. Remove or clearly mark dead `mock-data.ts`
3. Re-run a full Lighthouse performance audit with the backend available

## Skill application session

- `accessibility` drove the WCAG 2.2 audit and fixes: live status/error semantics, heading relationships, language annotation, decorative SVG handling, reduced-motion support, and equivalent chart tables.
- `vercel-react-best-practices` drove the React/Vite review. Next.js-only APIs (`next/image`, `next/font`, and the Next metadata API) were not applicable: this project is Vite and contains no `<img>` elements. Equivalent goals were met with `index.html` metadata, system fonts, stable chart fallbacks, and component code splitting.
- `performance` was selected after `npx skills find performance`. It was valuable because the baseline build emitted a 584.26 kB chunk warning. Lazy chart imports reduced the main chunk to 188.24 kB and the largest chunk to 342.30 kB, removing the warning.
- `financial-dashboard-data-integrity` was authored for rolling financial dates, finite zero-income calculations, shared formatting, and accessible chart equivalents. Applying it removed the fixed 2024 label and added period-range tests.

## Verification

- Baseline: 5 Vitest tests passed; lint passed; build passed with one chunk-size warning.
- Final: 8 Vitest tests passed; lint passed; build passed with no chunk-size warning.
- Lighthouse accessibility score: 100 on the rendered Vite application.
- Dark-theme text, chart, and badge combinations checked were above WCAG AA contrast thresholds; the lowest measured text combination was 5.17:1.
- The dashboard currently has no buttons, links, or inputs. There are no pointer-only actions or keyboard traps; chart values are exposed as semantic tables rather than requiring tooltip interaction.
