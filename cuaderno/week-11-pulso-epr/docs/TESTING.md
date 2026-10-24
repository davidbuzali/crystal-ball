# Mechanical test log

## Pass 1 - October 24, 2026

### Build and browser path

- TypeScript compilation: passed.
- Vite production build: passed after adding a project-local empty PostCSS configuration. Without it, Vite inherited an unrelated parent configuration and could not resolve `@tailwindcss/postcss`.
- Phone-width visual pass in the in-app browser: passed for hero hierarchy, warning visibility, input wrapping, route cards, and review gate.
- Accessibility-tree pass: headings, numeric controls, mode controls, status text, constraint selectors, burden table, review checkbox, and export button were exposed.
- Invented 24-SKU sample: loaded successfully; the synthetic feed and projection updated; one route passed all four declared constraints.
- Default 280-SKU sample: returned “Ninguna ruta está validada,” preserving the allowed no-winner state.

### Defect found

**Observed:** Switching from simulated to measured mode with zero elapsed minutes and zero checkpoints changed model confidence from `exploratoria` to `limitada` when evidence completeness was at least 70%.

**Why it mattered:** A label implied stronger evidence merely because the user selected a mode. That violated the evidence-integrity condition and could reward performative sensing.

**Fix:** `projectCycleTwo` now requires all of the following before displaying `limitada`: measured mode, at least 15 active minutes, at least one checkpoint, and at least 70% declared evidence completeness. The model never displays high confidence.

**Regression coverage:** Two tests distinguish empty measured mode from a meaningful measured sample.

### Additional privacy fix

The first build requested Google Fonts at runtime. The design did not need that disclosure, and the packet promised no third-party requests. The final build uses local system font stacks and makes no runtime network request after loading the static bundle.

## Deployment 1

- Timestamp: October 24, 2026 (America/Mexico_City)
- Production alias: <https://week-11-pulso-epr.vercel.app>
- Immutable deployment: <https://week-11-pulso-oyunq1qfp-davidbuzali.vercel.app>
- State: pre-fix baseline used for the documented test-fix-redeploy cycle.

## Deployment 2

- Timestamp: October 24, 2026 (America/Mexico_City)
- Production alias: <https://week-11-pulso-epr.vercel.app>
- Immutable deployment: <https://week-11-pulso-awl46q271-davidbuzali.vercel.app>
- State: confidence-gate fix deployed and verified in the live accessibility tree. Switching to measured mode with zero minutes and zero checkpoints now remains `CONFIANZA EXPLORATORIA`.

## Automated coverage

The logic suite checks:

1. input bounds and relational validation;
2. deterministic, labeled simulated sensing;
3. confidence gating for empty and meaningful measured samples;
4. conjunctive route constraints and the no-winner result;
5. mandatory human review before export; and
6. absence of common identity fields in the export.

## Persona-fix visual retest

- Phone-width projection section: passed; the white heading now sits on a navy background with clear contrast.
- Eligible route wording: passed in the accessibility tree as `PASA EL FILTRO · NO ES RECOMENDACIÓN`.
- Production deployment 3 completed at <https://week-11-pulso-epr.vercel.app>.

