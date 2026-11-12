# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.

## Bonus Exercise Submission

### Project

Hen Ho Nhung Khong Yeu State Machine

React 19 + Vite + CSS Modules.

### Implemented Features

- Four-state relationship FSM.
- Explicit valid transitions and Reset.
- Immutable asymmetric effort reducer.
- EM multiplier 0.1 and AI_DO multiplier 50.
- Pure derived scores and Red Flag condition.
- Accessible Red-Flag Meter.
- Ghosting message timeout of 5000 ms.
- Timer cancellation on reply, phase change and unmount.
- Stale timeout protection and StrictMode cleanup.
- Responsive interaction controls.

### Verification Commands

```powershell
node --test tests/relationship.test.js
npx.cmd vitest run tests/ghosting.ui.test.jsx --environment jsdom
npm.cmd run lint
npm.cmd run build$readmePath = "README.md"
$readme = Get-Content $readmePath -Raw -Encoding UTF8

if (-not $readme.Contains("## Bonus Exercise Submission")) {
    @'

## Bonus Exercise Submission

### Implemented Features

- Relationship FSM with four states.
- Immutable Asymmetric Effort Reducer.
- Pure derived impact scores.
- Accessible Red-Flag Meter.
- Ghosting Timer with 5-second timeout.
- Timer cleanup and stale timeout protection.
- Responsive React 19 interface.

### Documentation

- project-rules.md
- TASK_DECOMPOSITION.md
- AI_FAILURE_AUDIT.md

### Submission Screenshots

1. Initial FRIENDS state.
2. DATING_NO_LOVE with asymmetric scores.
3. Red Flag status and impact meter.
4. Pending Ghosting message.
5. GHOSTED_EXIT after timeout.
6. OFFICIAL_LOVE after canceling pending ghosting.
7. Automated test results.
8. Lighthouse Accessibility report.
9. Git commit history.

### Notes

Lighthouse Accessibility measures automated accessibility checks only. Keyboard and responsive behavior must also be tested manually.
