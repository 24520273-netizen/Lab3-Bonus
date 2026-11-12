import test from 'node:test'
import assert from 'node:assert/strict'

import {
  ACTORS,
  EVENTS,
  PHASES,
  initialState,
  relationshipReducer,
  getAvailableTransitions,
} from '../src/domain/relationshipModel.js'

import {
  calculateEffortScores,
  calculateRedFlag,
} from '../src/domain/relationshipSelectors.js'

test('FSM supports valid transitions', () => {
  let state = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  assert.equal(state.phase, PHASES.DATING_NO_LOVE)

  state = relationshipReducer(state, { type: EVENTS.COMMIT })
  assert.equal(state.phase, PHASES.OFFICIAL_LOVE)

  state = relationshipReducer(state, { type: EVENTS.EXIT })
  assert.equal(state.phase, PHASES.GHOSTED_EXIT)
})

test('FSM rejects invalid transitions', () => {
  const result = relationshipReducer(initialState, {
    type: EVENTS.COMMIT,
  })

  assert.strictEqual(result, initialState)
})

test('terminal state rejects transitions except reset', () => {
  const exited = relationshipReducer(initialState, {
    type: EVENTS.EXIT,
  })

  assert.equal(exited.phase, PHASES.GHOSTED_EXIT)
  assert.strictEqual(
    relationshipReducer(exited, { type: EVENTS.START_DATING }),
    exited,
  )

  const reset = relationshipReducer(exited, {
    type: EVENTS.RESET,
  })

  assert.deepEqual(reset, initialState)
})

test('available transitions follow FSM rules', () => {
  const friends = getAvailableTransitions(PHASES.FRIENDS)

  assert.equal(friends[EVENTS.START_DATING], PHASES.DATING_NO_LOVE)
  assert.equal(friends[EVENTS.COMMIT], undefined)
})

test('effort reducer preserves immutable logs', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const original = structuredClone(dating)

  const next = relationshipReducer(dating, {
    type: EVENTS.ADD_INTERACTION,
    id: 'em-1',
    actor: ACTORS.EM,
    steps: 100,
  })

  assert.deepEqual(dating, original)
  assert.notStrictEqual(next.interactions, dating.interactions)
  assert.equal(next.interactions.length, 1)
  assert.equal(next.interactions[0].multiplier, 0.1)
})

test('invalid effort actions are ignored', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  for (const steps of [-1, 0, 1.5, Number.NaN, Infinity]) {
    const next = relationshipReducer(dating, {
      type: EVENTS.ADD_INTERACTION,
      id: 'bad',
      actor: ACTORS.EM,
      steps,
    })

    assert.strictEqual(next, dating)
  }

  assert.strictEqual(
    relationshipReducer(initialState, {
      type: EVENTS.ADD_INTERACTION,
      id: 'early',
      actor: ACTORS.EM,
      steps: 1,
    }),
    initialState,
  )
})

test('duplicate IDs and invalid actors are rejected', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const state = relationshipReducer(dating, {
    type: EVENTS.ADD_INTERACTION,
    id: 'unique-1',
    actor: ACTORS.EM,
    steps: 1,
  })

  assert.strictEqual(
    relationshipReducer(state, {
      type: EVENTS.ADD_INTERACTION,
      id: 'unique-1',
      actor: ACTORS.AI_DO,
      steps: 1,
    }),
    state,
  )

  assert.strictEqual(
    relationshipReducer(state, {
      type: EVENTS.ADD_INTERACTION,
      id: 'new-id',
      actor: 'INVALID',
      steps: 1,
    }),
    state,
  )
})

test('asymmetric scores match slide example', () => {
  const scores = calculateEffortScores([
    { actor: ACTORS.EM, steps: 100 },
    { actor: ACTORS.AI_DO, steps: 1 },
  ])

  assert.equal(scores.myTries, 100)
  assert.equal(scores.rivalTries, 1)
  assert.equal(scores.myImpact, 10)
  assert.equal(scores.rivalImpact, 50)
  assert.equal(scores.difference, -40)

  assert.equal(calculateRedFlag(PHASES.DATING_NO_LOVE, scores), true)
  assert.equal(calculateRedFlag(PHASES.OFFICIAL_LOVE, scores), false)
})

test('score selectors do not mutate input', () => {
  const logs = [
    Object.freeze({ actor: ACTORS.EM, steps: 3 }),
  ]

  Object.freeze(logs)

  const scores = calculateEffortScores(logs)

  assert.equal(scores.myImpact, 0.3)
  assert.equal(logs.length, 1)
})

test('ghosting message is allowed only during dating', () => {
  const invalid = relationshipReducer(initialState, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-1',
  })

  assert.strictEqual(invalid, initialState)

  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const pending = relationshipReducer(dating, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-1',
  })

  assert.deepEqual(pending.pendingMessage, {
    id: 'message-1',
  })

  assert.equal(dating.pendingMessage, null)
})

test('duplicate pending messages are rejected', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const pending = relationshipReducer(dating, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-1',
  })

  const duplicate = relationshipReducer(pending, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-2',
  })

  assert.strictEqual(duplicate, pending)
})

test('reply cancels pending ghosting', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const pending = relationshipReducer(dating, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-1',
  })

  const replied = relationshipReducer(pending, {
    type: EVENTS.RECEIVE_REPLY,
    id: 'message-1',
  })

  assert.equal(replied.pendingMessage, null)
  assert.equal(replied.phase, PHASES.DATING_NO_LOVE)

  assert.strictEqual(
    relationshipReducer(replied, {
      type: EVENTS.GHOST_TIMEOUT,
      id: 'message-1',
    }),
    replied,
  )
})

test('valid ghost timeout ends relationship', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const pending = relationshipReducer(dating, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-1',
  })

  const ghosted = relationshipReducer(pending, {
    type: EVENTS.GHOST_TIMEOUT,
    id: 'message-1',
  })

  assert.equal(ghosted.phase, PHASES.GHOSTED_EXIT)
  assert.equal(ghosted.pendingMessage, null)
})

test('old timeout cannot affect a new message', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const first = relationshipReducer(dating, {
    type: EVENTS.SEND_MESSAGE,
    id: 'old-message',
  })

  const replied = relationshipReducer(first, {
    type: EVENTS.RECEIVE_REPLY,
    id: 'old-message',
  })

  const second = relationshipReducer(replied, {
    type: EVENTS.SEND_MESSAGE,
    id: 'new-message',
  })

  const staleTimeout = relationshipReducer(second, {
    type: EVENTS.GHOST_TIMEOUT,
    id: 'old-message',
  })

  assert.strictEqual(staleTimeout, second)
})

test('phase changes invalidate pending messages', () => {
  const dating = relationshipReducer(initialState, {
    type: EVENTS.START_DATING,
  })

  const pending = relationshipReducer(dating, {
    type: EVENTS.SEND_MESSAGE,
    id: 'message-1',
  })

  const official = relationshipReducer(pending, {
    type: EVENTS.COMMIT,
  })

  assert.equal(official.phase, PHASES.OFFICIAL_LOVE)
  assert.equal(official.pendingMessage, null)

  assert.strictEqual(
    relationshipReducer(official, {
      type: EVENTS.GHOST_TIMEOUT,
      id: 'message-1',
    }),
    official,
  )
})
