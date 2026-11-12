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

- HW1 Drum Machine: seven pads, `e.code` keyboard hook, repeat/input guards, cleanup, live hit log, and meter are implemented. Manual keyboard-hook checks remain unverified.
- HW2 Piano: generated A0–C8 keys, eight-voice FIFO synth, recording/replay, and memoized keys are implemented; prior 375px, voice-steal, render-isolation, and unmount checks passed. The piano JSX wrappers now use semantic sections with no `<div>`.
- HW3 PUBG VN Arena: anti-drift timer, optimistic 409 rollback, VND crates, four-squad leaderboard, sort/filter controls, and four drop phases are implemented. Prior 409 rollback and duplicate-claim checks passed; the newly changed sort/filter, phases, and 375px layout still need browser verification.


## Remaining verification

- [x] `npm run lint` after the latest homework changes
- [x] `npm run build` after the latest homework changes
- [x] In-class exercise 375px browser checks: viewport/document widths matched; inputs were labeled; no duplicate IDs or browser errors.
- [x] Verify telemetry loading and success card heights match at 220px.
- [x] Record five AI-generated defects, fixing commits, and evidence in `AI_FAILURE_AUDIT.md`.
- [x] Verify telemetry under DevTools Slow 3G at 375px: skeleton appears, retry works, request reaches success, and no console errors occur.
- [ ] Accessibility/responsive check at 375px after the latest homework changes: all inputs labeled, no duplicate IDs, and no horizontal overflow.
