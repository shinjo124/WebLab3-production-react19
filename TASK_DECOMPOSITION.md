# Lab 3 Task Decomposition

## Project rules

- React 19 functional components and `createRoot` only.
- No class components, `ReactDOM.render`, `defaultProps`, `keyCode`, or `window.alert()`.
- Exercise 1 `DeveloperCard.jsx` contains no `<div>` elements.
- Pair every form control with a `<label htmlFor>` generated with `useId()`.
- Keep state updates immutable; derive filtered and sorted lists during render.
- Clean up timers, listeners, and fetches created by effects.
- Check responsive behavior at 375px.

## In-class exercises

| Exercise | Work | Status |
|---|---|---|
| 1 | Semantic `DeveloperCard` and reusable `SkillBadge`, avatar fallback, CSS Module | Implemented; 375px browser check passed |
| 2 | `SMART_PEOPLE`, search, IQ filter, sorting, delete/reset, live count, responsive CSS | Implemented; interactions and 375px no-overflow checked |
| 3 | PUBG squad telemetry, four states, abortable mock API, retry, skeleton/error UI | Implemented; success/error states checked; skeleton and card both 220px |
| Bonus | Situationship phases, immutable signal log, derived score/red flag, cleaned-up ghost timer | Implemented |

## Homework scope

The homework folders and starter files are scaffolded. Their assignment behavior is not implemented yet; keep this distinction clear in future updates.

- [ ] HW1 Drum Machine: `e.code` controls, repeat/focus guards, listener cleanup, hit log, and accessible pads.
- [ ] HW2 Piano: generate A0–C8, eight-voice FIFO synth, sequence recording/replay, and memoized keys.
- [ ] HW3 PUBG VN Arena: anti-drift timer, optimistic claim with 409 rollback, leaderboard/filter, and VND formatting.

## Remaining verification

- [x] `npm run lint`
- [x] `npm run build`
- [x] 375px browser check: viewport/document widths match; all inputs labeled; no duplicate IDs or browser errors.
- [x] Verify telemetry loading and success card heights match at 220px.
- [x] Record three AI-generated defects, fixes, and evidence in `AI_FAILURE_AUDIT.md`.
- [ ] Verify telemetry under DevTools Slow 3G.
- [ ] Complete the 3-minute live defense with AI tools closed.