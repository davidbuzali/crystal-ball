# Security floor

Checked October 24, 2026.

| Requirement | State | Evidence |
|---|---|---|
| No secrets in code or repository | Pass | No API keys, tokens, credentials, or runtime environment variables. Pattern scan passed. |
| Auth for personal data | Not applicable | The app has no account, backend, database, or personal-data field. |
| Row Level Security | Not applicable | No Supabase project or user table exists. |
| Every input validated | Pass | Numeric ranges and relational constraints are enforced; selects are enumerated; no free text exists. |
| No real personal data | Pass | Paula and all example values are explicitly invented. |

Additional controls:

- All calculation happens in the browser.
- The final build loads no runtime third-party fonts, scripts, APIs, analytics, pixels, or cookies.
- Motion permission is optional, requested only after a direct click, sampled as a count, and never leaves the browser.
- The JSON export requires human review and contains only aggregate values and model metadata.
- The app blocks unsupported compliance, recycling, recovery, worker-benefit, and return claims in visible copy.
- Paper evidence is routed to human review; it is not automatically excluded.

