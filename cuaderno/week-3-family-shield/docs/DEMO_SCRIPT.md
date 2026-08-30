# Family Shield — video script

**Student:** David Buzali  
**Target length:** 3 minutes of live demonstration + 30 seconds of reflection  
**Video filename:** `DEMO_davidbuzali.mp4`  
**Live URL:** https://family-shield-week-3.vercel.app  
**Separate repository:** https://github.com/davidbuzali/family-shield-week-3

The English narration below is a draft for David to read naturally. Spanish text in the screen directions matches the interface. Personal reflection should be adjusted if it does not describe David's actual experience. Timing includes short pauses for clicks and scrolling; rehearse once rather than speeding up to fit.

## Before recording

- Open the live Vercel URL at the start screen; keep the URL visible briefly.
- Use a readable, phone-sized browser window if convenient. Avoid a tiny preview that viewers cannot read.
- Use only the built-in fictional practice case. Do not upload a real family message or show personal notifications, API keys, environment settings, or credentials.
- Keep the `ANÁLISIS SIMULADO` and `LLAMADA SIMULADA` labels visible when explaining those steps. This recording does not demonstrate live AI extraction or actual phone calls.
- Read only the quoted narration. Screen directions are not spoken.

## 0:00–0:20 — Who this is for

**Screen:** Start at the live URL on “Pausa antes de pagar.”

> Hi, I'm David, and this is Family Shield. I built it for Elena, a fictional sixty-seven-year-old retiree in Mexico City who receives an urgent request for money from someone claiming to be her son. The goal is to help her pause and verify before paying.

## 0:20–0:45 — The specific situation

**Screen:** Click **Usar caso de práctica** and show the fictional message preview.

> I'll walk through it as Elena. The message claims Diego had an accident and needs twenty thousand pesos within thirty minutes. It tells her not to call and includes the family word, JACARANDA. Those details can feel convincing, but the app does not treat them as proof of identity.

## 0:45–1:10 — Add the screenshot

**Screen:** Show the privacy note, fictional-data confirmation, and preview. The practice button already loads the image and selects the confirmation. Click **Organizar la solicitud**.

> I load the fictional practice screenshot. The upload screen explains the privacy boundary and limits files to supported images under five megabytes. This deployed demo uses a preset, simulated analysis, not live AI. The code includes a Gemini vision route. Here, I'm demonstrating the interaction and safety rules.

## 1:10–1:45 — Organize the claim without authenticating it

**Screen:** Pause at the top so **NO PAGUES TODAVÍA** and **ANÁLISIS SIMULADO** are readable. Scroll through the amount, deadline, pressure signals, and family-word warning.

> The next screen starts with “No pagues todavía”: don't pay yet. It organizes what the message claims: who is asking, the amount, the emergency, and the deadline. It also highlights pressure, including urgency and the instruction not to call. This is not a verdict that the message is real or fake. Even the correct family word does not authorize a payment. Elena still needs an independent channel.

## 1:45–2:15 — Try an established contact

**Screen:** Click **Verificar por otro canal**. Show the warning against using numbers from the message. Select **Diego**, then **No respondió / no fue posible confirmar**.

> I choose “Verificar por otro canal.” Elena must use a contact she already knew before the emergency, never a number supplied in the suspicious message. I select Diego's saved contact. This call is simulated; the app does not actually place or record it. I mark him unavailable, and it offers the remaining trusted contacts.

## 2:15–2:40 — Demonstrate the fallback

**Screen:** Briefly show Laura and Roberto as backup contacts. To keep the recording within time, click **No pude confirmar con nadie**. Do not claim to have called the backups.

> Laura and Roberto are the backup options. To demonstrate the no-confirmation outcome, I select “No pude confirmar con nadie.” The result is Protocol Only: don't pay yet. Waiting is the correct action, not a failure to help her family. The app never moves money or makes Elena's final decision for her.

## 2:40–3:00 — What testing changed

**Screen:** Keep the outcome screen and stop instruction visible. No need to leave the live app for a code tour.

> During the simulated persona walkthrough, I found that screen transitions could hide the stop warning because the old scroll position carried over. I corrected that and checked both transitions on the live deployment. The recorded test run also passed all fifteen automated safety checks.

## 3:00–3:30 — What changed my mind this week

**Screen:** Stay on the result or switch to camera. Deliver this as a personal reflection, not a feature list.

> What changed my mind was realizing that a safety message is useless if the user never sees it. I focused on the logic, but the persona walkthrough exposed a scrolling problem that hid the warning. Success now means helping someone take the right next action under stress. For Family Shield, that's pausing and verifying, not pretending to detect truth.

## Final check

- Finish the live walkthrough by 3:00 and reserve the last 30 seconds for reflection.
- Keep the simulation labels readable and do not claim a real-user test or a fresh-chat persona test: the documented walkthrough used the existing working conversation.
- Save the finished video as `DEMO_davidbuzali.mp4` and check that the narration and interface are both legible.
- Keep the script and coursework in `~/crystal-ball/cuaderno`; commit and push completed work, and keep the separate Week 3 repository synchronized.
- The video is an additional submission artifact, not a fourth PDF.
