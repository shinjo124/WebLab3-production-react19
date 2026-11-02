# AI Failure Audit

This file is a capture template for the required three-bug AI audit. No AI-generated failure with DevTools evidence has been recorded in this workspace yet; the entries below are scenarios to verify, not claims that bugs occurred. Do not submit them as verified until the prompt, generated code, observed failure, and fix commit are recorded.

## Candidate 1: Derived list duplicated in state

- **Status:** Pending verification
- **Prompt:** Ask an AI assistant to add name and IQ filters to `ScientistDirectory`.
- **Check for:** A second `useState` for filtered results synchronized by `useEffect`.
- **Proof to capture:** React Profiler render count while typing one character.
- **Expected fix:** Keep only source data and control values in state; derive the visible array during render.
- **Evidence / fix commit:** Pending

## Candidate 2: Stale or uncanceled telemetry request

- **Status:** Pending verification
- **Prompt:** Ask an AI assistant to add telemetry fetching when the selected squad changes.
- **Check for:** Missing effect cleanup, missing `AbortController`, or a visible error when a request is intentionally aborted.
- **Proof to capture:** Network panel while rapidly switching squads; show canceled prior requests and the final displayed squad.
- **Expected fix:** Abort in cleanup and ignore `AbortError`.
- **Evidence / fix commit:** Pending

## Candidate 3: Direct state mutation

- **Status:** Pending verification
- **Prompt:** Ask an AI assistant to implement directory deletion or reset.
- **Check for:** Mutating `people` with `splice`, `push`, or direct assignment before calling its setter.
- **Proof to capture:** DevTools or code diff showing mutation and its effect on the rendered list.
- **Expected fix:** Use a new array, such as `filter` for deletion.
- **Evidence / fix commit:** Pending