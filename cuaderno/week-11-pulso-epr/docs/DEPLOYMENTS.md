# Deployment log

## Deployment 1 - baseline

- Date: October 24, 2026
- Environment: Vercel production (first project deployment)
- Alias: <https://week-11-pulso-epr.vercel.app>
- Immutable URL: <https://week-11-pulso-oyunq1qfp-davidbuzali.vercel.app>
- Purpose: mechanical test baseline before the documented confidence-label fix.

## Deployment 2 - mechanical fix

- Date: October 24, 2026
- Environment: Vercel production
- Alias: <https://week-11-pulso-epr.vercel.app>
- Immutable URL: <https://week-11-pulso-awl46q271-davidbuzali.vercel.app>
- Change: require a meaningful measured sample before increasing model confidence; remove runtime Google Fonts request.
- Verification: live accessibility tree showed `CONFIANZA EXPLORATORIA` after switching to measured mode with zero minutes and zero checkpoints.

## Deployment 3 - persona fix

- Date: October 24, 2026
- Environment: Vercel production
- Alias: <https://week-11-pulso-epr.vercel.app>
- Immutable URL: <https://week-11-pulso-5lfnwerl9-davidbuzali.vercel.app>
- Change: repair projection-section contrast at phone width and clarify that passing a route filter is not a recommendation.
- Verification: final production build completed successfully; alias updated.

