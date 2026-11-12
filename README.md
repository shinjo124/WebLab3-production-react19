# Lab 3 — React 19

A React 19 and Vite lab with three in-class exercises and three interactive homework projects.

## Project structure

```text
src/
├── App.jsx              # Hash-based navigation for all six views
├── components/          # In-class exercises and shared exercise components
└── homeworks/           # Drum machine, piano, and PUBG arena projects
```

## Exercises

| View | Description | Open directly |
| --- | --- | --- |
| Exercise 1 | Developer profile card with reusable skill badges | `/#ex1` |
| Exercise 2 | Searchable and sortable scientist directory | `/#ex2` |
| Exercise 3 | PUBG match telemetry with loading, error, and success states | `/#ex3` |

## Homeworks

| View | Description | Open directly |
| --- | --- | --- |
| Homework 1 | Seven-pad Web Audio drum machine with keyboard controls | `/#hw1` |
| Homework 2 | Algorithmically generated 88-key piano and polyphonic synth | `/#hw2` |
| Homework 3 | KRAFTON PUBG VN arena with airdrop timer and squad leaderboard | `/#hw3` |

Start the development server and choose a view from the navigation, or append its hash to the local URL (for example, `http://localhost:5173/#hw1`).

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run build
npm run lint
```

## Final lab checklist

### In-class exercises

- [x] Exercise 1: semantic `DeveloperCard`, reusable `SkillBadge`, description list, stable skill IDs, and no `<div>` in the card.
- [x] Exercise 1: HTTPS avatar with dimensions, alt text, initials fallback, and CSS Module.
- [x] Exercise 1: browser check at 375px; no horizontal overflow.
- [x] Exercise 2: six `SMART_PEOPLE`; labeled controls using `useId()`; IQ uses `valueAsNumber`.
- [x] Exercise 2: render-time name/IQ filtering and `.toSorted()`; immutable delete/reset; live count.
- [x] Exercise 2: mobile-first CSS Module and 375px no-overflow check.
- [x] Exercise 3: four view states, three squad buttons, abortable mock API, retry, skeleton and accessible error.
- [x] Exercise 3: abort cleanup; skeleton and success card both measure 220px at 375px.
- [x] Exercise 3: 375px browser check, no horizontal overflow, no console errors.
- [x] Exercise 3: verify in DevTools with Slow 3G throttling; loading skeleton appeared, retry worked, and the request reached success.

### Bonus

- [x] Four-phase state machine, immutable signal log, derived scores/red flag, and cleaned-up five-second timer.

### Submission

- [x] `project-rules.md`, `TASK_DECOMPOSITION.md`, and `AI_FAILURE_AUDIT.md`.
- [x] Five AI-generated bugs documented with detection, fixes, and verification.
- [x] Production build passes after the latest changes.
- [x] Lint passes after the latest changes.
- [x] Updated homework layout and controls verified at 375px with no horizontal overflow.
- [x] Arena sort/filter controls and all four drop phases verified in the browser.
