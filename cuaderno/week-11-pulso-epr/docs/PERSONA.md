# Persona test log - Paula

**Date:** October 24, 2026  
**Layer:** Synthetic persona, Layer 1  
**Product state:** Live deployment 2 at <https://week-11-pulso-epr.vercel.app>  
**Evidence:** Reset browser state, phone-width screenshots, accessibility-tree output, and interactive sample flow.

## Persona

Paula is an invented 37-year-old packaging-compliance coordinator at a mid-sized cosmetics importer in Guadalajara. She reconciles about 280 SKUs quarterly across sales exports, supplier PDFs, email, and a consultant. She is comfortable with spreadsheets but distrusts opaque ROI claims and stops using a tool when an estimate looks like a fact. She must explain any purchase to finance and refuses to certify something she cannot defend.

No real person, company, or personal data was used.

## Task

Paula was asked to answer one question: **“With the information visible here, which operating routes deserve a real quotation or second-cycle test?”** She was not asked to choose a vendor, certify compliance, or estimate environmental impact.

## Walkthrough and narrated hesitation

### Screen 1 - Promise and limits

> “I understand the job: measure before buying. The red warning tells me this does not certify anything. I would continue because it does not ask for an account or a file.”

**Observed:** Strong comprehension. “Adapta antes de inventar” matches Paula's procurement concern. The no-account/no-file line reduces fear of exposing company records.

### Screen 2 - Cycle inputs and phone sensor

> “I know our SKU count and consultant fee. ‘Evidence complete’ worries me because that percentage is my estimate, not a verified audit. The simulated feed is obvious. I do not understand why movement matters, but it is optional.”

**Confusions logged:**

1. `Evidencia completa` could be mistaken for verified completeness, though the panel labels the inputs `Declarado por ti`.
2. Device-motion sampling has weak commercial meaning for Paula; its optional status prevents it from blocking the task.
3. The timer and checkpoint counter are more credible signals than movement and should remain primary.

**Decision:** Keep motion optional and subordinate. A real pilot should remove it unless observation proves incremental value.

### Screen 3 - Synthetic projection

> “I can see the range and that the model is synthetic, but the section title almost disappears on my phone. If I miss the title, I may not understand that this is a projection step.”

**Critical confusion:** The dark full-bleed background was behind the page's stacking context. On the tested phone viewport, the white section heading rendered against the ivory page and lost contrast. This was the highest-severity issue because it obscured both sequence and caution.

**Fix:** Isolate the projection section's stacking context so its navy background reliably sits behind the white heading and cards at every breakpoint.

### Screen 4 - Route comparison

> “The partner platform has a green border. Even though the text says ‘pasa para investigar,’ green can feel like the product is recommending it. I need a sentence I can repeat to finance.”

**Confusion:** A visually eligible route could be read as a product recommendation.

**Fix:** Change the verdict to **“Pasa el filtro · no es recomendación.”** Preserve the estimated-data badge and “Por comprobar” line.

### Screen 5 - Shadow and export

> “The blocked claims are clear. I like that paper evidence is protected. The checkbox says I reviewed assumptions, and the sentence above says I am not approving compliance. I can export this as a discussion record.”

**Observed:** The review gate distinguishes assumption review from legal approval. Export remains disabled until checked and contains aggregate fields only.

## Confusion log

| Severity | Confusion | Resolution |
|---|---|---|
| Critical | White projection heading lacked reliable contrast on phone. | Fixed stacking context; visually retested. |
| High | Green eligible card could feel like a recommendation. | Verdict now says “no es recomendación.” |
| Medium | Self-declared completeness could feel verified. | Existing `Declarado por ti` label retained; future pilot tests alternative wording. |
| Low | Motion sampling lacks a clear procurement use. | Kept optional and subordinate; identified as a kill candidate. |
| Low | Human checkbox might feel like certification. | Existing copy explicitly limits it to assumptions, not compliance or impact. |

## Retest

- The projection heading now sits on the navy background at phone width.
- The route card says “Pasa el filtro · no es recomendación.”
- The critical task remains completable without motion permission.
- Synthetic/model labels remain present after the changes.
- The review gate remains disabled until explicitly checked.

## Outcome

Paula can identify a route that merits investigation without confusing it with a vendor recommendation or a compliance decision. The persona test does not validate the product with a real buyer. The next honest test is a moderated session with a packaging-compliance lead using comparable aggregate records from two cycles.

