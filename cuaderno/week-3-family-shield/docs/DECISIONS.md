# Family Shield decision log

## 2026-08-29 - Packet and implementation close

- Chose a screenshot-based vision flow because audio is outside the permitted build scope.
- Kept the primary user as Elena, a fictional 67-year-old retiree in Mexico City.
- Selected the Diego / MXN $20,000 / 30-minute fictional message as the central test case.
- Used Bitdefender Scamio as the strongest adjacent screenshot-analysis benchmark, while refusing its detector-style safety verdict.
- Required every outcome to preserve Elena's control and every failed verification to enter Protocol Only.
- Chose a durable-data-free architecture so authentication and Row Level Security are not needed for this slice.
- Kept an explicit simulated mode for tests and keyless demonstrations; it may never masquerade as live analysis.

### Tomorrow's first move

Run the corrected build, commit the complete testable slice, and create Deployment 1 with simulated analysis visibly labeled.

## 2026-08-29 - First working slice close

- Implemented a six-state mobile flow from fictional screenshot upload through independent verification.
- Added a bounded Gemini server route plus a deterministic simulated mode for tests and keyless demonstrations.
- Prevented the AI response from producing authenticity, fraud, payment, or contact conclusions through a strict schema and server validation.
- Verified both the confirmed path and the all-contacts-unavailable Protocol Only path at 390 x 844 px.
- Automated 15 schema, upload, flow, and rendered-build safety checks.
- Fixed a genuine inherited-build defect by isolating the Week 3 PostCSS configuration.
- Fixed a keyboard-focus defect by projecting the hidden upload input's focus state onto the visible upload card.

### Tomorrow's first move

Deploy the labeled simulated slice, run the mechanical test plan at the live URL, and prepare the fresh-chat persona test.

## 2026-08-29 - Deployment 1 close

- Published the complete working slice at https://family-shield-week-3.vercel.app.
- Kept Deployment 1 in visibly labeled simulated-analysis mode so the public checkpoint is testable without presenting generated output as live AI analysis.
- Created a dedicated `family-shield-week-3` Vercel project after the existing repository-level `crystal-ball` project attempted to build from the repository root.
- Re-ran the central fictional case at 390 x 844 px on the public production URL.
- Verified that the unconfirmed-contact branch ends at Protocol Only and never exposes a payment action.

### Tomorrow's first move

Run the Elena persona test in a fresh conversation using the prompt in `PACKET.md`, record every hesitation in `docs/TESTING.md`, implement the highest-severity correction, and publish Deployment 2.

## 2026-08-29 - Persona walkthrough correction

- Ran the Elena persona walkthrough in the existing working conversation at the student's request and documented the loss of fresh-context independence as a method limitation.
- Evaluated only what appeared on each 390 x 844 px screen so implementation knowledge could not excuse unclear interface behavior.
- Found a high-severity transition defect: the organized-summary and verification screens inherited the previous mobile scroll position, partially hiding the top stop banner.
- Added a step-change scroll reset and repeated it on the next animation frame so the safety banner remains the first visible content after navigation.
- The first public correction attempt showed that verification could restore the old position after that frame, even though the local retest passed. Added a final 100 ms reset and treated the intermediate build as unaccepted rather than closing the checkpoint prematurely.
- Retested both affected transitions locally and on the public Vercel alias at 390 x 844 px; the full "NO PAGUES TODAVÍA" banner now appears on entry.
- Logged "PROTOCOLO ONLY" as a medium-severity localization opportunity, but kept it in this slice because the surrounding Spanish copy makes the required behavior explicit and the course packet uses that label.

### Tomorrow's first move

Publish Deployment 2, repeat the corrected transitions at the public URL, finalize `PERSONA_davidbuzali.pdf`, and close the Week 3 checkpoint.

## 2026-08-29 - Deployment 2 close

- Accepted commit `e3c2be0` as the corrected Deployment 2 source.
- Verified the organized-summary and independent-verification entries at 390 x 844 px on https://family-shield-week-3.vercel.app.
- Confirmed the production build remains visibly labeled as simulated analysis.
- Preserved the canonical public alias while Vercel promoted the corrected production deployment.
- Closed the persona checkpoint with 15 passing safety tests and the final persona PDF.

### Tomorrow's first move

Package the Week 3 submission links and artifacts, then begin the next course checkpoint without expanding Family Shield beyond its declared scope.

## 2026-08-30 - Video script close

- Prepared `docs/DEMO_SCRIPT.md` around the assignment's three-minute live walkthrough and final thirty-second reflection.
- Matched screen directions to the shipped Spanish interface and the fictional Diego / MXN $20,000 / 30-minute practice case.
- Explicitly distinguished the deployed preset analysis and simulated calls from live AI extraction and real phone calls.
- Used the documented scroll-position correction for the testing explanation without claiming an independent fresh-chat or real-user evaluation.
- Kept the script in Markdown so the final submission set remains exactly three PDFs plus the separate video.
- Included the separate Week 3 GitHub repository and preserved the existing coursework archive.

### Tomorrow's first move

Rehearse the script against the live Vercel URL, personalize the final reflection, and record `DEMO_davidbuzali.mp4` with the final 30 seconds reserved for what changed my mind.
