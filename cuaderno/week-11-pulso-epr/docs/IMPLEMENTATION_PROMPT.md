# Pulso EPR - implementation prompt

Build the Week 11 working slice described in `docs/PACKET.md` as a static React + TypeScript + Vite application in Spanish (Mexico). The product is a commercial viability comparator for repeated packaging-evidence reconciliation. It must not imply legal compliance, recycling, environmental benefit, or a recommendation to buy software.

## Product behavior

Implement one coherent flow with four stages:

1. **Define the cycle.** Accept only bounded aggregate inputs: SKU count, changed SKUs, evidence completeness, exceptions, internal hourly cost, external cycle fee, first-cycle hours, review hours, and desired data-control level. Provide a 24-SKU invented example.
2. **Sense the work.** Offer a measured phone mode with an elapsed timer and checkpoint counter. Record page-hidden interruptions and, where supported, optional device-motion samples after explicit permission. Offer a separate simulated feed with an always-visible label and deterministic sample values. Never collect location, files, identity, contacts, or free text.
3. **Project cycle two.** Use a deterministic function named `projectCycleTwo` with documented synthetic coefficients. Return a low/base/high hour range, confidence label, model version, and the three strongest drivers. Never call this production AI. Never output one deceptively precise number.
4. **Compare routes.** Evaluate spreadsheet, consultant, partner platform, and local adapter. Calculate first-year total cost and projected cycle hours from transparent assumptions. Apply user-selected hard constraints for maximum annual cost, maximum cycle hours, minimum traceability, and minimum data control. An option is eligible only if it passes all constraints. Preserve the possible outcome that none qualifies.

## Non-negotiable safeguards

- Show a persistent banner: “No demuestra cumplimiento ni reciclaje.”
- Label every datum as measured, user-provided, synthetic estimate, or missing.
- Keep human review mandatory before export.
- Describe approval as review of assumptions, never regulatory approval.
- Include a burden check naming the compliance lead, suppliers, consultant/operator, finance approver, and potentially excluded paper-based participants.
- Do not collect worker identity or automatically reject non-digital evidence.
- Do not award sustainability scores, recovery credits, labels, or environmental claims.
- Include one-click reset and JSON export. Export only aggregates, assumptions, results, model metadata, and review state.
- Keep all computation local. No secrets, API calls, database, analytics, cookies, account, or third-party scripts.

## Visual direction

Use a warm ivory background, dark navy typography, forest-green actions, muted amber estimates, and coral warnings. Pair an editorial serif display face with a clean system sans. Prefer strong information hierarchy, generous spacing, thin borders, soft shadows, and clear status chips over generic gradients. The app should feel like an independent diagnostic instrument, not a sales dashboard.

## Accessibility and responsive behavior

- Use semantic landmarks, labels, fieldsets, and live regions.
- Ensure keyboard operation and visible focus.
- Meet WCAG AA contrast for core text and controls.
- At phone width, preserve the warning, stage labels, route failures, and review gate without horizontal scrolling.
- Respect `prefers-reduced-motion`.

## Small testable features and acceptance criteria

### Commit 1 - Packet before code

- `docs/PACKET.md` exists with the generated mockup, Mermaid flow/swimlane, benchmark, long view, scope, architecture, tests, all Blueprint conditions, and the shadow clause.

### Commit 2 - Build contract

- This prompt translates the packet into implementation constraints and a commit plan.

### Commit 3 - Validated cycle capture

- Inputs reject values outside documented bounds.
- Measured and simulated modes have distinct labels and state.
- Timer, checkpoints, interruptions, and optional motion samples produce a local sensor summary.

### Commit 4 - Explainable projection and route comparison

- Synthetic ML returns a stable range and driver list.
- Route calculations are reproducible.
- All hard constraints are conjunctive.
- “No route validated” is supported.

### Commit 5 - Human and shadow safeguards

- Persistent limitations, evidence statuses, burden check, paper-evidence route, and human review gate are visible.
- Export is unavailable until assumptions are reviewed.
- Export includes no free text or identity.

### Commit 6 - Mechanical test, defect fix, first and second deployment evidence

- Unit and production-build checks pass.
- At least one observed defect is logged, fixed, retested, and included in `docs/TESTING.md`.
- `docs/DEPLOYMENTS.md` records two deployment URLs/timestamps when authentication permits.

### Commit 7 - Persona test and submission artifacts

- `docs/PERSONA.md` records the synthetic user's walkthrough, confusions, chosen fix, and retest.
- Packet, persona log, and build chat are exported to PDF after visual QA.
- `DECISIONS.md` records the final state and next move.

## Required commands

Run the repository's `test` and `build` scripts after meaningful changes. Search tracked source and built output for likely secrets and forbidden claims. Do not mark deployment or persona validation complete without direct evidence.

