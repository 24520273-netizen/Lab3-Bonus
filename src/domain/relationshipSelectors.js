import { ACTORS, MULTIPLIERS, PHASES } from './relationshipModel.js'

export function calculateEffortScores(interactions) {
  const totals = interactions.reduce(
    (result, interaction) => {
      if (interaction.actor === ACTORS.EM) {
        return {
          ...result,
          myTries: result.myTries + interaction.steps,
        }
      }

      if (interaction.actor === ACTORS.AI_DO) {
        return {
          ...result,
          rivalTries: result.rivalTries + interaction.steps,
        }
      }

      return result
    },
    { myTries: 0, rivalTries: 0 },
  )

  const myImpact = Number(
    (totals.myTries * MULTIPLIERS[ACTORS.EM]).toFixed(1),
  )

  const rivalImpact = totals.rivalTries * MULTIPLIERS[ACTORS.AI_DO]

  const difference = Number(
    (myImpact - rivalImpact).toFixed(1),
  )

  return {
    ...totals,
    myImpact,
    rivalImpact,
    difference,
  }
}

export function calculateRedFlag(phase, scores) {
  return (
    phase === PHASES.DATING_NO_LOVE &&
    scores.myImpact < scores.rivalImpact
  )
}
