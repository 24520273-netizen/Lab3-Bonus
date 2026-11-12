# Lab 03 Bonus - Project Rules

## Project
- Name: Lab 3 - BonusExercise
- Exercise: Hen Ho Nhung Khong Yeu State Machine
- Framework: React 19 + Vite
- Language: JavaScript
- Styling: CSS Modules

## Architecture
- Use React Functional Components.
- Use a single canonical FSM phase.
- Keep state transitions explicit and deterministic.
- Use immutable reducer updates.
- Keep action logs immutable.
- Compute impact scores and Red Flag status from source state.
- Do not synchronize derived values using useEffect.
- Separate pure domain logic from React UI effects.
- Never mutate reducer state or action payloads.

## Async and Effect Rules
- Start ghosting timers only for valid pending messages.
- Clear timers in useEffect cleanup.
- Prevent duplicate pending timers and stale callbacks.
- Clear pending messages on valid phase exits.
- Use AbortController only for operations supporting AbortSignal.
- Do not create memory leaks.

## UI and Accessibility
- Main component: SituationshipAnalyzer.
- Use semantic HTML and article.
- Use useId for form label associations when necessary.
- Support keyboard input and visible focus.
- Announce status through output with aria-live.
- Do not communicate status through color alone.
- Target WCAG 2.2 AA and Lighthouse Accessibility 100.
- Support a viewport width of 375px.
- Never use window.alert.

## Git Workflow
- Follow Plan -> Implement -> Verify -> Commit.
- Keep commits atomic and meaningful.
- Preserve slide-required commit messages exactly.
- Do not push, merge, reset, rebase, or force push automatically.
- Do not change global Git configuration.
- Do not modify HW1, HW2, or HW3 repositories.
- Never claim PASS without verification.

## AI Failure Audit
- Maintain AI_FAILURE_AUDIT.md during implementation.
- Record at least 3 actual AI errors.
- Include evidence, reproduction, corrections and verification.
- Never fabricate failures, screenshots or commit hashes.
- If fewer than 3 genuine failures occur, report the shortfall honestly.

## Scope
- Step 1: Setup and architecture planning only.
- Step 2: FSM, reducer and interaction logic.
- Step 3: Red Flag, ghosting, accessibility, testing and audit.
