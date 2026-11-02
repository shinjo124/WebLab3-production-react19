# AI Failure Audit

## Bug 01: Telemetry skeleton and result card had different heights

- **Prompt:** “220px pulsing skeleton with `aria-busy`, matching the success card’s height”
- **AI-generated code:** Both elements used `min-height: 220px`, while the result card kept default heading and paragraph margins.
- **Risk:** During a successful load, the result card was taller than the skeleton and shifted content, violating the matching-height requirement.
- **Detection:** At a 375px browser viewport, Playwright measured the skeleton at 220px and the result card at 229.4375px.
- **Fix:** Reduced the result card heading and paragraph margins so its minimum height stays 220px.
- **Verification:** Both measured 220px after the fix; viewport and document widths were both 375px. See `lab3-mobile-375-success.png` in the task outputs.
- **Fix commit:** `1046ca2`

## Bug 02: Telemetry entered loading from inside the effect

- **Prompt:** “`useEffect` with an AbortController that ignores AbortError and returns cleanup”
- **AI-generated code:** The effect synchronously called `setView(LOADING)` before starting the request.
- **Risk:** This caused an avoidable render from inside the effect. On a squad change, the old squad result could remain visible until the effect ran.
- **Detection:** Oxlint reported `react(set-state-in-effect)` at the loading update.
- **Fix:** Mark loading in the squad selection and retry handlers; derive the loading view while the selected squad and result do not match.
- **Verification:** Lint is clean; the 375px browser check showed no console errors.
- **Fix commit:** `fcec1fa`

## Bug 03: Developer card used a fixed heading ID

- **Prompt:** “Write JSX of `DeveloperCard`: `<article>`, `<header>`, `<hgroup>`, `<dl>` metrics, `<ul>` skills. Zero `<div>`”
- **AI-generated code:** The card hard-coded `developer-card-title` for both `aria-labelledby` and the heading `id`.
- **Risk:** Rendering multiple cards would duplicate the ID, making the accessible name reference ambiguous.
- **Detection:** Code audit found the fixed ID in the reusable component.
- **Fix:** Generate the heading ID with React `useId()`.
- **Verification:** Browser DOM audit found no duplicate IDs in the rendered app; lint and build pass.
- **Fix commit:** `fcec1fa`