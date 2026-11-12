export const PHASES = Object.freeze({
  FRIENDS: 'FRIENDS',
  DATING_NO_LOVE: 'DATING_NO_LOVE',
  OFFICIAL_LOVE: 'OFFICIAL_LOVE',
  GHOSTED_EXIT: 'GHOSTED_EXIT',
})

export const EVENTS = Object.freeze({
  START_DATING: 'START_DATING',
  COMMIT: 'COMMIT',
  EXIT: 'EXIT',
  RESET: 'RESET',
  ADD_INTERACTION: 'ADD_INTERACTION',
})

export const ACTORS = Object.freeze({
  EM: 'EM',
  AI_DO: 'AI_DO',
})

export const MULTIPLIERS = Object.freeze({
  [ACTORS.EM]: 0.1,
  [ACTORS.AI_DO]: 50,
})

const TRANSITIONS = {
  [PHASES.FRIENDS]: {
    [EVENTS.START_DATING]: PHASES.DATING_NO_LOVE,
    [EVENTS.EXIT]: PHASES.GHOSTED_EXIT,
  },
  [PHASES.DATING_NO_LOVE]: {
    [EVENTS.COMMIT]: PHASES.OFFICIAL_LOVE,
    [EVENTS.EXIT]: PHASES.GHOSTED_EXIT,
  },
  [PHASES.OFFICIAL_LOVE]: {
    [EVENTS.EXIT]: PHASES.GHOSTED_EXIT,
  },
  [PHASES.GHOSTED_EXIT]: {
    [EVENTS.RESET]: PHASES.FRIENDS,
  },
}

export const initialState = {
  phase: PHASES.FRIENDS,
  interactions: [],
  pendingMessage: null,
}

export function getAvailableTransitions(phase) {
  return TRANSITIONS[phase] ?? {}
}

export function relationshipReducer(state, action) {
  if (action?.type === EVENTS.ADD_INTERACTION) {
    if (state.phase !== PHASES.DATING_NO_LOVE) {
      return state
    }

    const { id, actor, steps } = action

    if (
      typeof id !== 'string' ||
      id.trim() === '' ||
      id !== id.trim() ||
      !Object.hasOwn(MULTIPLIERS, actor) ||
      !Number.isSafeInteger(steps) ||
      steps <= 0 ||
      state.interactions.some((item) => item.id === id)
    ) {
      return state
    }

    const interaction = {
      id,
      actor,
      steps,
      multiplier: MULTIPLIERS[actor],
    }

    return {
      ...state,
      interactions: [...state.interactions, interaction],
    }
  }

  const nextPhase = TRANSITIONS[state.phase]?.[action?.type]

  if (!nextPhase) {
    return state
  }

  if (action.type === EVENTS.RESET) {
    return {
      phase: PHASES.FRIENDS,
      interactions: [],
      pendingMessage: null,
    }
  }

  return {
    ...state,
    phase: nextPhase,
    pendingMessage: null,
  }
}
