# Family Shield - Week 3

Family Shield is a mobile-first coursework prototype that turns an urgent family payment request into a pause-and-verify flow. It organizes a fictional screenshot, explicitly refuses to authenticate it, and routes the user to pre-established independent contacts.

## Local development

```bash
pnpm install
pnpm dev
```

The default local experience uses a visibly labeled deterministic simulation. To exercise the live server route, configure the variables from `.env.example`, set both analysis modes to `live`, and run through a Vercel-compatible development environment.

## Checks

```bash
pnpm check
```

## Safety boundary

This prototype uses fictional practice data. It does not determine whether a message is real or fraudulent, authorize a payment, store screenshots, or use audio.
