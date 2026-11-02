# Lab 3 Task Decomposition

## Project rules to enforce

- Use React 19 functional components and `createRoot`.
- Do not use class components, `ReactDOM.render`, `defaultProps`, `keyCode`, or `window.alert()`.
- Exercise 1 must contain no `<div>` elements in `DeveloperCard.jsx`.
- Give every form control a `<label htmlFor>` connected with `useId()`.
- Update state immutably. Compute filtered and sorted data during render; do not use `useEffect` for derived state.
- Return cleanup from effects that create timers, listeners, or fetch requests.
- Check the layout at 375px before wider screen sizes.

## Work breakdown and commit plan

The deck requires at least 6–8 atomic commits. This plan targets 8 commits. Keep each commit limited to the listed task and update this file if the scope changes.

| # | Work item | Deliverable and completion check | Commit |
|---|---|---|---|
| 1 | Set up app structure and shared data | Create the exercise and homework folders/components; define stable IDs and data shapes; app still starts from `src/main.jsx` with React 19 `createRoot`. | `chore: scaffold lab 3 exercises and homework folders` |
| 2 | Exercise 1: semantic profile card | Implement `DeveloperCard` and `SkillBadge`; zero `<div>` in `DeveloperCard.jsx`; semantic profile metadata and skill list with stable keys; HTTPS avatar with dimensions and fallback. | `feat(ex1): build semantic developer profile card` |
| 3 | Exercise 1: responsive styling | Add CSS Module styling and check card at 375px; no horizontal overflow. | `style(ex1): add responsive profile card styles` |
| 4 | Exercise 2: directory interactions | Implement search, minimum-IQ filter, IQ/age sort, delete and reset; use `useId()` labels, `valueAsNumber`, `.toSorted()`, stable IDs, and derived results during render. | `feat(ex2): add searchable sortable scientist directory` |
| 5 | Exercise 2: accessible results and mobile layout | Add live result count and verify labeled controls and 375px layout. | `feat(ex2): add accessible status and mobile layout` |
| 6 | Exercise 3: telemetry states and requests | Implement squad selection, `IDLE`/`LOADING`/`SUCCESS`/`ERROR` states, request cancellation, and retry; ignore intentional `AbortError`s. | `feat(ex3): add abortable PUBG telemetry states` |
| 7 | Exercise 3: loading and error presentation | Add the 220px skeleton, accessible error/retry UI, and responsive styling. | `feat(ex3): add telemetry skeleton and recovery UI` |
| 8 | Integration and audit | Complete `AI_FAILURE_AUDIT.md` with at least three AI bugs, DevTools evidence, and fixes; review all project rules and record any remaining homework work. | `docs: add AI failure audit and final lab checklist` |

## Exercise acceptance checklist

### Exercise 1 — Developer profile card

- [ ] Build reusable `DeveloperCard` and `SkillBadge` components.
- [ ] Use semantic landmarks and a description list for profile metadata.
- [ ] Keep `DeveloperCard.jsx` free of `<div>` elements.
- [ ] Use stable entity IDs for skills; use CSS Modules.
- [ ] Use an HTTPS avatar with explicit dimensions and initials fallback.
- [ ] Confirm the card fits at 375px.

### Exercise 2 — Scientist directory

- [ ] Add case-insensitive name search and minimum-IQ filtering.
- [ ] Add IQ/age sorting with `.toSorted()`.
- [ ] Add immutable delete and reset behavior.
- [ ] Connect every input to a label using `useId()`; read IQ with `valueAsNumber`.
- [ ] Derive visible results during render, without an effect or duplicate derived state.
- [ ] Announce the result count through an accessible live status.

### Exercise 3 — PUBG Vietnam telemetry

- [ ] Support the specified squads and telemetry fields.
- [ ] Represent the view with `IDLE`, `LOADING`, `SUCCESS`, and `ERROR` states.
- [ ] Show a 220px skeleton while loading.
- [ ] Cancel stale fetches on squad change and unmount; suppress errors caused by abort.
- [ ] Provide retry and announce failures accessibly; do not use `window.alert()`.

### Homework and bonus tracking

These are separate deck requirements beyond the three in-class exercises; schedule them after the in-class work unless the instructor sets a different priority.

- [ ] HW1 Drum Machine: `e.code`, repeat/focus guards, keyboard listener cleanup, accessible hit log and controls.
- [ ] HW2 88-Key Piano: generate A0–C8, support 8-voice FIFO voice stealing, release audio cleanly, and isolate key renders with `React.memo`.
- [ ] HW3 PUBG VN Arena: anti-drift countdown with `visibilitychange` resync, optimistic claim with 409 rollback, leaderboard/filter, and VND formatting.
- [ ] Bonus Situationship Analyzer: finite relationship phases, immutable effort log, derived score/red flag, labeled controls, and cleaned-up ghosting timer.