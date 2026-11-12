# AI Failure Audit - Lab 03 Bonus

## Overview

Project: Lab 3 - BonusExercise

This audit documents three observable issues arising during AI-assisted development. Evidence is based on repository history, terminal output, and a Lighthouse report.

The cases include a documentation inconsistency, a UI behavior issue and an accessibility issue. They are not presented as three independent React runtime failures.

## Failure 1 - Incorrect Project Name in Planning

### Related Prompt
The user changed the setup requirement to use the existing folder `Lab 3 - BonusExercise` rather than create `Lab3-Bonus`.

### AI-Generated Issue
The earlier task decomposition still contained:

`Project: Lab3-Bonus`

This was inconsistent with the actual repository folder.

### Root Cause
AI-generated planning documentation was not fully synchronized with the changed project location.

### Evidence
Compare TASK_DECOMPOSITION.md between:
- Original planning commit: 01625d2
- Corrected planning commit: 0f37dc2

The original file contains `Project: Lab3-Bonus`.
The corrected file contains `Project: Lab 3 - BonusExercise`.

### Correction
Updated the task decomposition to reflect the real repository directory.

### Fix Commit
0f37dc2

## Failure 2 - Misleading Ghosting Status After Exit

### Related Prompt
Implement Ghosting Timer with correct relationship-state integration and meaningful UI feedback.

### AI-Generated Issue
The original message status used a generic fallback:

`Không có tin nhắn đang chờ.`

This did not explain that the relationship had ended after Ghosting.

### Root Cause
The generated UI only distinguished pending and non-pending messages, rather than adapting the message to the relationship phase.

### Evidence
Compare SituationshipAnalyzer.jsx between:
- Original Ghosting implementation: 354195a
- Improved Ghosting UI: 1616338

The historical code contains the generic fallback.
The corrected code contains a phase-specific exit message.

### Correction
Added relationship-aware status text for GHOSTED_EXIT and other phases.

### Fix Commit
1616338

## Failure 3 - Missing Main Landmark

### Related Prompt
Implement semantic HTML, accessible components and target Lighthouse Accessibility 100.

### AI-Generated Issue
The original App.jsx mounted the main component without a main landmark.

Original structure:

`<SituationshipAnalyzer />`

### Root Cause
The generated page used an article component without providing a main landmark for the document.

### Evidence
Chrome Lighthouse initially reported:
- Accessibility: 98/100
- Finding: Document does not have a main landmark.

A screenshot of this report was captured during the development session.

Compare src/App.jsx before and after the accessibility fix.

### Correction
Wrapped SituationshipAnalyzer in a semantic main element while retaining the required article component.

### Fix Commit
fa638bd

## Audit Limitations

- All three issues are supported by historical source evidence.
- The Lighthouse issue additionally has a captured diagnostic screenshot.
- The documentation mismatch is not a runtime defect.
- The Ghosting message issue is a UI feedback defect rather than a timer failure.
- Any additional requirement for three runtime-code failures would need separate genuine evidence.
- No fabricated error logs or commit hashes are used.

## Final Verification

Verify these before submission:
- FSM transition tests
- Immutable reducer tests
- Asymmetric scoring tests
- Ghosting lifecycle tests
- React StrictMode and cleanup tests
- ESLint and production build
- Keyboard navigation
- 375px responsive layout
- Lighthouse Accessibility result
