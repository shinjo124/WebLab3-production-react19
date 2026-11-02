# Lab 3 Final Checklist

## In-class exercises

- [x] Exercise 1: semantic `DeveloperCard` structure, metrics list, skills list, and reusable `SkillBadge`.
- [x] Exercise 1: no `<div>` in `DeveloperCard.jsx`; skill items use stable IDs.
- [x] Exercise 1: HTTPS avatar, explicit dimensions, alt text, and initials fallback.
- [x] Exercise 1: CSS Module with variables and wrapping layout.
- [ ] Exercise 1: verify visually at 375px.
- [x] Exercise 2: six `SMART_PEOPLE` records with stable IDs, names, ages, and IQ values.
- [x] Exercise 2: labeled search, minimum-IQ, and sort inputs using `useId()`; numeric input uses `valueAsNumber`.
- [x] Exercise 2: derive filtered/sorted results during render with `.toSorted()`; no effect for derived state.
- [x] Exercise 2: immutable delete and reset; live result count.
- [x] Exercise 2: mobile-first CSS Module for the form and list.
- [ ] Exercise 2: verify visually at 375px.
- [x] Exercise 3: four-state view, squad selection buttons with `aria-pressed`, retry counter.
- [x] Exercise 3: mock API has 1.2-second delay, 35% simulated failure, and abort support.
- [x] Exercise 3: effect aborts requests during cleanup and ignores `AbortError`.
- [x] Exercise 3: 220px pulsing skeleton with `aria-busy`; success card has matching minimum height.
- [x] Exercise 3: accessible `role="alert"` error and retry button; no `alert()` call.
- [ ] Exercise 3: verify visually at 375px and under Slow 3G in DevTools.

## Homeworks and bonus

- [ ] HW1 Drum Machine behavior, keyboard accessibility, and listener cleanup. Current files are placeholders.
- [ ] HW2 generated 88-key piano, eight-voice FIFO synth, and render isolation. Current files are placeholders.
- [ ] HW3 anti-drift timer, optimistic claim/409 rollback, leaderboard, and filtering. Current files are placeholders.
- [ ] Bonus Situationship Analyzer state machine and cleanup.

## Submission and defense

- [x] `project-rules.md`
- [x] `TASK_DECOMPOSITION.md`
- [ ] `AI_FAILURE_AUDIT.md`: capture three actual bugs with DevTools proof and fix commits; candidate scenarios are documented but unverified.
- [ ] Record at least 6–8 atomic Git commits.
- [ ] Complete the 3-minute live refactoring defense with AI tools closed.
- [ ] Run a production build and complete responsive/accessibility verification.