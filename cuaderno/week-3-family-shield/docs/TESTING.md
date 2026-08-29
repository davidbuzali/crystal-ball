# Family Shield testing log

## Mechanical pass

| Test ID | Date | Build / deployment | Scenario | Expected result | Actual result | Status | Evidence | Bug or decision | Retest |
|---|---|---|---|---|---|---|---|---|---|
| BUILD-01 | 2026-08-29 | Local production build | Build the isolated Week 3 app inside the existing coursework workspace | Week 3 resolves only its own configuration and dependencies | Vite inherited the parent PostCSS configuration and failed because the isolated app did not install the parent's Tailwind plugin | Fixed | Build output | Added a local empty PostCSS configuration so Week 3 cannot inherit Week 2 styling infrastructure | Production build passes |
| UNIT-01 | 2026-08-29 | Local | Run schema, upload, verification, and rendered-build tests | All safety invariants pass | 15 tests passed; production build passed | Passed | Terminal output | - | Passed |
| UI-01 | 2026-08-29 | Local, 390 x 844 px | Complete central fictional practice path | Summary is readable and verification begins without coaching | Passed with no console errors | Passed | `docs/assets/test-01-upload.png`, `test-02-summary.png`, `test-03-verify.png` | - | Passed |
| UI-02 | 2026-08-29 | Local, 390 x 844 px | Mark every trusted contact unavailable | Final state is Protocol Only and contains no payment action | Reached Protocol Only after Diego, Laura, and Roberto were unavailable | Passed | `docs/assets/test-04-protocol-only.png` | - | Passed |
| ACCESS-01 | 2026-08-29 | Local accessibility inspection | Every interactive control is keyboard-focusable and shows focus | All controls had `tabIndex=0`, but the clipped file input did not project a visible focus indicator onto its upload card | Fixed | `docs/assets/test-05-upload-focus.png` and DOM inspection | Added `:focus-within` styling to the upload card | Focused input now produces a visible 4 px amber outline; passed |
| DEPLOY-01 | 2026-08-29 | Deployment 1, Vercel production, 390 x 844 px | Run the central fictional case from the public URL and choose “No pude confirmar con nadie” | The simulated analysis is visibly labeled, no payment action appears, and the flow ends at Protocol Only | Public production flow passed from practice-case load through `PROTOCOLO ONLY`; no private data used | Passed | [Deployment 1](https://family-shield-week-3.vercel.app) | A dedicated Vercel project was created because the existing repository-level project expected a package manifest at the repository root | Passed |

## Persona-test preparation

The student chose to run the persona walkthrough in the same working conversation so the implementation context remained available. This is a documented limitation: the evaluator already knew the intended safety behavior. To reduce confirmation bias, each judgment below used only the visible 390 x 844 px screen and treated hidden implementation details as unavailable to Elena.

Screens reviewed in order:

1. Start and privacy explanation
2. Screenshot upload
3. AI-organized request summary
4. No-authenticity warning and stop instruction
5. Independent-contact selection
6. Primary contact unavailable
7. Protocol Only result

Use the persona prompt from `PACKET.md` and log every confusion below.

| Screen | Elena's interpretation | Hesitation | Severity | Proposed correction | Correction made | Retest result |
|---|---|---|---|---|---|---|
| Start | I should pause before paying and use another way to verify who is asking | The difference between the urgent-flow and practice buttons requires a short read | Low | Keep the primary and practice actions visually distinct | No change | The intended pause behavior remained clear |
| Upload and privacy | I should add the message screenshot; this coursework demo must use only invented information | "Proveedor externo de IA" is mildly technical, but the instruction not to upload real messages is clear | Low | Consider plainer provider language in a later version | No change | Privacy boundary remained understandable |
| Organized summary | The app has reorganized what the message claims; it has not authenticated Diego | The screen opened at the previous scroll position, leaving most of "NO PAGUES TODAVÍA" above the mobile viewport | High | Reset the viewport to the top whenever the flow changes screen | Added a step-change scroll reset in `src/App.tsx` | Passed locally at 390 x 844 px; the complete stop banner is now the first content after both major transitions |
| Warning and family code | The AI cannot say whether Diego sent the message, and JACARANDA does not permit a payment | No material hesitation | None | Keep both warnings adjacent to the organized claim | No change | Both boundaries were understood |
| Independent contacts | I should call a number I already had, never one supplied in the suspicious message | The same retained-scroll defect could partially hide the stop banner on entry | High | Apply the same step-change scroll reset | Covered by the same correction | Passed locally; the stop banner and verification heading are fully visible on entry |
| Diego unavailable | Diego did not answer, so I should try Laura or Roberto | No material hesitation; the next action is explicit | None | Keep the unavailable notice above the remaining contacts | No change | Backup path remained clear |
| Protocol Only | I should not pay; waiting and following the protocol is the correct outcome | The English word "Only" is less natural than the surrounding Spanish, but the explanatory copy removes ambiguity | Medium | Consider "SOLO PROTOCOLO" while preserving the course label in a later iteration | No change in this slice | Elena's required safe behavior remained clear |

Persona success criteria passed: the evaluator understood that the AI had not authenticated Diego, that JACARANDA did not authorize payment, that only a previously established contact should be used, and that Protocol Only is a correct protective outcome rather than a personal failure.

## Deployment record

| Deployment | URL | Commit | Analysis mode | Date | Notes |
|---|---|---|---|---|---|
| Deployment 1 | https://family-shield-week-3.vercel.app | `48faac1` | Simulated, visibly labeled | 2026-08-29 | Public mobile flow verified through Protocol Only at 390 x 844 px |
| Deployment 2 | Pending | Pending | Simulated or live, visibly labeled | Pending | Mechanical and persona correction |
