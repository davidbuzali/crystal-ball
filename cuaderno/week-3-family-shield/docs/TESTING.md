# Family Shield testing log

## Mechanical pass

| Test ID | Date | Build / deployment | Scenario | Expected result | Actual result | Status | Evidence | Bug or decision | Retest |
|---|---|---|---|---|---|---|---|---|---|
| BUILD-01 | 2026-08-29 | Local production build | Build the isolated Week 3 app inside the existing coursework workspace | Week 3 resolves only its own configuration and dependencies | Vite inherited the parent PostCSS configuration and failed because the isolated app did not install the parent's Tailwind plugin | Fixed | Build output | Added a local empty PostCSS configuration so Week 3 cannot inherit Week 2 styling infrastructure | Production build passes |
| UNIT-01 | 2026-08-29 | Local | Run schema, upload, verification, and rendered-build tests | All safety invariants pass | 15 tests passed; production build passed | Passed | Terminal output | - | Passed |
| UI-01 | 2026-08-29 | Local, 390 x 844 px | Complete central fictional practice path | Summary is readable and verification begins without coaching | Passed with no console errors | Passed | `docs/assets/test-01-upload.png`, `test-02-summary.png`, `test-03-verify.png` | - | Passed |
| UI-02 | 2026-08-29 | Local, 390 x 844 px | Mark every trusted contact unavailable | Final state is Protocol Only and contains no payment action | Reached Protocol Only after Diego, Laura, and Roberto were unavailable | Passed | `docs/assets/test-04-protocol-only.png` | - | Passed |
| ACCESS-01 | 2026-08-29 | Local accessibility inspection | Every interactive control is keyboard-focusable and shows focus | All controls had `tabIndex=0`, but the clipped file input did not project a visible focus indicator onto its upload card | Fixed | `docs/assets/test-05-upload-focus.png` and DOM inspection | Added `:focus-within` styling to the upload card | Focused input now produces a visible 4 px amber outline; passed |

## Persona-test preparation

Run the persona test in a fresh conversation after Deployment 1. Capture these screens in order:

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
| Pending | Pending | Pending | Pending | Pending | Pending | Pending |

## Deployment record

| Deployment | URL | Commit | Analysis mode | Date | Notes |
|---|---|---|---|---|---|
| Deployment 1 | Pending | Pending | Simulated or live, visibly labeled | Pending | Complete testable slice |
| Deployment 2 | Pending | Pending | Simulated or live, visibly labeled | Pending | Mechanical and persona correction |
