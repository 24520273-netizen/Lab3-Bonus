# LAB 03 BONUS - TASK DECOMPOSITION

## 1. Project Overview

Project: Lab3-Bonus
Exercise: Hen Ho Nhung Khong Yeu State Machine
Main component: SituationshipAnalyzer

Goal:
Build an accessible React 19 relationship simulation using a
Finite State Machine, immutable action logs, pure derived state
and properly cleaned up asynchronous effects.

Workflow:
Plan -> Implement -> Verify -> Commit

Target: 3 steps, 10 valid commits.

## 2. Requirements Checklist

### Relationship FSM
- [ ] Implement four canonical relationship phases.
- [ ] Validate every relationship transition.
- [ ] Reject invalid transition requests.
- [ ] Prevent contradictory relationship states.
- [ ] Display current phase and valid actions.

### Asymmetric Effort
- [ ] Implement immutable interaction logs.
- [ ] Support actors EM and AI_DO.
- [ ] Support positive interaction step counts.
- [ ] Apply EM multiplier of 0.1.
- [ ] Apply AI_DO multiplier of 50.
- [ ] Derive tries and scores from interaction logs.
- [ ] Show interactions and impact scores.

### Red Flag
- [ ] Calculate Red Flag from source state.
- [ ] Show Stable or Red Flag text.
- [ ] Provide an accessible visual impact meter.
- [ ] Announce changes using output and aria-live.
- [ ] Never store redundant calculated flags.

### Ghosting
- [ ] Enable message sending during DATING_NO_LOVE.
- [ ] Start a 5000 ms timeout for a pending message.
- [ ] Allow a reply to cancel pending ghosting.
- [ ] Prevent duplicate pending messages.
- [ ] Clear timers on relationship transition.
- [ ] Clear timers on component unmount.
- [ ] Guard against stale timeout events.
- [ ] Use AbortController only for abortable operations.

### Accessibility
- [ ] Use article and semantic HTML.
- [ ] Use accessible buttons and form labels.
- [ ] Use useId for form controls where needed.
- [ ] Support keyboard interaction.
- [ ] Provide visible focus indicators.
- [ ] Support 375px mobile viewport.
- [ ] Verify WCAG 2.2 AA relevant criteria.
- [ ] Target Lighthouse Accessibility 100.
- [ ] Avoid window.alert.

### Delivery
- [x] Define project-rules.md.
- [x] Establish React 19 project skeleton.
- [ ] Implement and verify feature requirements.
- [ ] Create AI_FAILURE_AUDIT.md.
- [ ] Record at least 3 genuine AI failures with evidence.
- [ ] Verify tests, lint and production build.
- [ ] Review Git history and clean working tree.

## 3. FSM Architecture

Use the contract state names exclusively:

FRIENDS
DATING_NO_LOVE
OFFICIAL_LOVE
GHOSTED_EXIT

Initial phase:
FRIENDS

Terminal phase:
GHOSTED_EXIT

### Allowed Phase Transitions

FRIENDS:
- START_DATING -> DATING_NO_LOVE
- EXIT -> GHOSTED_EXIT

DATING_NO_LOVE:
- COMMIT -> OFFICIAL_LOVE
- EXIT -> GHOSTED_EXIT
- GHOST_TIMEOUT -> GHOSTED_EXIT, if message ID matches

OFFICIAL_LOVE:
- EXIT -> GHOSTED_EXIT

GHOSTED_EXIT:
- No outgoing transitions

Invalid transitions must preserve the existing state.

Any phase exit must invalidate the pending message.

## 4. State Contract

Planned domain state:

{
  phase: 'FRIENDS',
  interactions: [],
  pendingMessage: null
}

Interaction entry:

{
  id: 'unique-id',
  actor: 'EM',
  steps: 1,
  multiplier: 0.1
}

Pending message:

{
  id: 'unique-id'
}

State invariants:
- phase must be a valid FSM phase.
- interactions must remain immutable.
- IDs must identify their corresponding actions.
- steps must be a positive integer.
- actor must be EM or AI_DO.
- multiplier is determined by actor, not user input.
- pendingMessage may exist only during DATING_NO_LOVE.
- at most one message may be pending.
- derived scores and flags are not stored in state.

## 5. Reducer Contract

Planned reducer:

relationshipReducer(state, action) -> nextState

Supported action types:

START_DATING
COMMIT
EXIT
ADD_INTERACTION
SEND_MESSAGE
RECEIVE_REPLY
GHOST_TIMEOUT

Guards:
- START_DATING requires FRIENDS.
- COMMIT requires DATING_NO_LOVE.
- EXIT requires a nonterminal phase.
- ADD_INTERACTION requires DATING_NO_LOVE.
- SEND_MESSAGE requires DATING_NO_LOVE with no pending message.
- RECEIVE_REPLY requires a matching pending message.
- GHOST_TIMEOUT requires a matching pending message ID.
- Invalid actions return the original state.
- Valid terminal transitions clear pendingMessage.

Reducer rules:
- Must remain pure.
- Must not mutate state or action payloads.
- Must not call setTimeout or perform side effects.
- Must use immutable updates for action logs.

## 6. Derived Impact Contract

Selectors calculate values from interactions:

myTries = sum of EM steps
rivalTries = sum of AI_DO steps

myImpact = myTries * 0.1
rivalImpact = rivalTries * 50

Examples:
EM performs 100 steps -> 10 points.
AI_DO performs 1 step -> 50 points.

Red Flag condition:

phase === 'DATING_NO_LOVE'
AND myImpact < rivalImpact

Status:
- Red Flag when the condition is true.
- Stable otherwise.

No useEffect is allowed solely for deriving these values.

## 7. Ghosting Lifecycle

Timeout duration: 5000 milliseconds.

Flow:
1. User sends a message during DATING_NO_LOVE.
2. Reducer stores one pending message ID.
3. useEffect starts one timeout.
4. A reply clears the pending message.
5. A phase transition clears the pending message.
6. Effect cleanup cancels the timeout when dependencies change.
7. Cleanup also runs on component unmount.
8. Timeout dispatches GHOST_TIMEOUT with the captured message ID.
9. Reducer verifies the ID before changing phase.

React StrictMode must not leave duplicate active timers.

Use clearTimeout for setTimeout.
Do not use AbortController for plain setTimeout.
No network operation is required for this exercise.

## 8. Component Architecture

src/
  components/
    SituationshipAnalyzer.jsx
    SituationshipAnalyzer.module.css
  domain/
    relationshipModel.js
    relationshipSelectors.js
  App.jsx
  main.jsx
  index.css

Files inside domain/ are planned for Step 2.

SituationshipAnalyzer:
- React Functional Component.
- No required external props.
- Owns relationship state through useReducer.
- Handles user interaction events.
- Renders phase, impact, status and message controls.
- Owns ghosting effect lifecycle in Step 3.

App:
- Mounts SituationshipAnalyzer.

relationshipModel:
- Defines constants and state transitions.
- Exports initial state and pure reducer.

relationshipSelectors:
- Exports pure impact and Red Flag calculations.

UI-only state:
- May contain form draft values.
- Must not duplicate canonical relationship state.

## 9. Accessibility Contract

- Root UI uses article.
- Buttons expose meaningful accessible names.
- Forms use associated labels.
- useId provides stable input IDs where needed.
- Status uses output role=status aria-live=polite.
- Red Flag includes visible text, not only red color.
- Focus-visible styles remain available.
- All required interactions work with a keyboard.
- Layout remains usable at 375px width.

## 10. Verification Checklist

### Step 1
- [ ] Node, npm and Git verified.
- [ ] React 19 installed.
- [ ] Component skeleton created.
- [ ] CSS Modules integrated.
- [ ] ESLint passes.
- [ ] Production build passes.
- [ ] Browser mount checked.
- [ ] Two valid commits created.

### Step 2
- [ ] FSM transition tests pass.
- [ ] Invalid transitions are rejected.
- [ ] Reducer immutable update tests pass.
- [ ] Asymmetric score tests pass.
- [ ] Interaction UI works.
- [ ] Lint and build pass.

### Step 3
- [ ] Red Flag conditions tested.
- [ ] 5000 ms timeout tested with fake timers.
- [ ] Reply cancellation tested.
- [ ] Phase change cleanup tested.
- [ ] Unmount cleanup tested.
- [ ] Stale timeout ignored.
- [ ] Accessibility and responsive UI checked.
- [ ] Lint and production build pass.
- [ ] AI audit contains genuine documented evidence.
- [ ] Final Git working tree clean.

## 11. Commit Plan

### Step 1 - Setup and Planning

1. chore(bonus): initialize react19 situationship project
2. docs(bonus): define fsm architecture and task decomposition

### Step 2 - FSM and Interaction

3. feat(fsm): model HenHoKhongYeu state machine
4. feat(bonus): implement asymmetric effort reducer
5. feat(bonus): add relationship interaction controls
6. test(bonus): verify fsm transitions and immutable logs

### Step 3 - Red Flag, Ghosting and Audit

7. feat(ui): add derived red-flag meter & ghosting cleanup
8. feat(bonus): improve responsive accessibility
9. test(bonus): verify ghosting lifecycle and red flag behavior
10. docs(bonus): finalize ai failure audit and submission checklist

The two slide-provided commit messages must remain unchanged.

Do not add empty commits or fabricate work to reach a target count.

## 12. Step 1 Scope Boundary

Step 1 only prepares the project and documents architecture.

Do not implement:
- FSM transitions.
- Effort reducer.
- Interaction logs.
- Red Flag calculations.
- Ghosting timer.
- Functional interaction controls.

These belong to Steps 2 and 3.
