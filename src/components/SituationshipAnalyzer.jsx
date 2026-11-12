import { useId, useReducer, useState } from 'react'
import {
  ACTORS,
  EVENTS,
  PHASES,
  getAvailableTransitions,
  initialState,
  relationshipReducer,
} from '../domain/relationshipModel.js'
import { calculateEffortScores } from '../domain/relationshipSelectors.js'
import styles from './SituationshipAnalyzer.module.css'

const phaseLabels = {
  [PHASES.FRIENDS]: 'Bạn bè',
  [PHASES.DATING_NO_LOVE]: 'Hẹn hò nhưng không yêu',
  [PHASES.OFFICIAL_LOVE]: 'Mối quan hệ chính thức',
  [PHASES.GHOSTED_EXIT]: 'Đã kết thúc mối quan hệ',
}

const transitionButtons = [
  { type: EVENTS.START_DATING, label: 'Bắt đầu hẹn hò' },
  { type: EVENTS.COMMIT, label: 'Xác nhận yêu' },
  { type: EVENTS.EXIT, label: 'Kết thúc quan hệ' },
  { type: EVENTS.RESET, label: 'Bắt đầu lại' },
]

export default function SituationshipAnalyzer() {
  const [state, dispatch] = useReducer(relationshipReducer, initialState)
  const [steps, setSteps] = useState('1')
  const stepsId = useId()
  const stepsHelpId = useId()

  const availableTransitions = getAvailableTransitions(state.phase)
  const scores = calculateEffortScores(state.interactions)

  const canAddEffort = state.phase === PHASES.DATING_NO_LOVE
  const parsedSteps = Number(steps)
  const validSteps =
    steps.trim() !== '' &&
    Number.isSafeInteger(parsedSteps) &&
    parsedSteps > 0 &&
    parsedSteps <= 100000

  function addEffort(actor) {
    if (!canAddEffort || !validSteps) return

    dispatch({
      type: EVENTS.ADD_INTERACTION,
      id: crypto.randomUUID(),
      actor,
      steps: parsedSteps,
    })
  }

  const recentInteractions = state.interactions.slice(-5).reverse()

  return (
    <article className={styles.card} aria-labelledby="situationship-title">
      <p className={styles.eyebrow}>LAB 03 · BONUS EXERCISE</p>

      <h1 id="situationship-title">Hẹn Hò Nhưng Không Yêu</h1>

      <p className={styles.description}>
        Relationship Finite State Machine
      </p>

      <section className={styles.section} aria-labelledby="phase-heading">
        <h2 id="phase-heading" className={styles.sectionHeading}>
          Trạng thái quan hệ
        </h2>

        <output className={styles.status} role="status" aria-live="polite">
          {phaseLabels[state.phase]}
        </output>

        <div className={styles.actions}>
          {transitionButtons.map(({ type, label }) => (
            <button
              key={type}
              type="button"
              className={styles.button}
              disabled={!Object.hasOwn(availableTransitions, type)}
              onClick={() => dispatch({ type })}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.section} aria-labelledby="effort-heading">
        <h2 id="effort-heading" className={styles.sectionHeading}>
          Mức độ cố gắng
        </h2>

        <div className={styles.field}>
          <label htmlFor={stepsId}>Số lần tương tác</label>

          <input
            id={stepsId}
            className={styles.input}
            type="number"
            min="1"
            max="100000"
            step="1"
            value={steps}
            onChange={(event) => setSteps(event.target.value)}
            aria-describedby={stepsHelpId}
            aria-invalid={!validSteps}
            disabled={!canAddEffort}
          />

          <small id={stepsHelpId}>
            Nhập số nguyên từ 1 đến 100000.
          </small>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={styles.button}
            disabled={!canAddEffort || !validSteps}
            onClick={() => addEffort(ACTORS.EM)}
          >
            EM cố gắng
          </button>

          <button
            type="button"
            className={styles.button}
            disabled={!canAddEffort || !validSteps}
            onClick={() => addEffort(ACTORS.AI_DO)}
          >
            AI ĐÓ cố gắng
          </button>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="score-heading">
        <h2 id="score-heading" className={styles.sectionHeading}>
          Bảng điểm tương tác
        </h2>

        <div className={styles.scores}>
          <div className={styles.score}>
            <strong>EM</strong>
            <span>{scores.myTries} lần</span>
            <output className={styles.scoreValue}>{scores.myImpact} điểm</output>
          </div>

          <div className={styles.score}>
            <strong>AI ĐÓ</strong>
            <span>{scores.rivalTries} lần</span>
            <output className={styles.scoreValue}>{scores.rivalImpact} điểm</output>
          </div>
        </div>

        <p className={styles.difference}>
          Chênh lệch EM - AI ĐÓ: <strong>{scores.difference} điểm</strong>
        </p>
      </section>

      <section className={styles.section} aria-labelledby="history-heading">
        <h2 id="history-heading" className={styles.sectionHeading}>
          Lịch sử tương tác
        </h2>

        {recentInteractions.length === 0 ? (
          <p className={styles.note}>Chưa có tương tác nào.</p>
        ) : (
          <ol className={styles.log}>
            {recentInteractions.map((interaction) => (
              <li key={interaction.id} className={styles.logItem}>
                <strong>{interaction.actor === ACTORS.EM ? 'EM' : 'AI ĐÓ'}</strong>
                {' · '}
                {interaction.steps} lần
                {' · '}
                {Number((interaction.steps * interaction.multiplier).toFixed(1))} điểm
              </li>
            ))}
          </ol>
        )}
      </section>
    </article>
  )
}
