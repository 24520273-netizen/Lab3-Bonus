import { useReducer } from 'react'
import {
  initialState,
  relationshipReducer,
  PHASES,
} from '../domain/relationshipModel.js'
import styles from './SituationshipAnalyzer.module.css'

const phaseLabels = {
  [PHASES.FRIENDS]: 'Bạn bè',
  [PHASES.DATING_NO_LOVE]: 'Hẹn hò nhưng không yêu',
  [PHASES.OFFICIAL_LOVE]: 'Mối quan hệ chính thức',
  [PHASES.GHOSTED_EXIT]: 'Đã kết thúc mối quan hệ',
}

export default function SituationshipAnalyzer() {
  const [state] = useReducer(relationshipReducer, initialState)

  return (
    <article className={styles.card} aria-labelledby="situationship-title">
      <p className={styles.eyebrow}>LAB 03 · BONUS EXERCISE</p>

      <h1 id="situationship-title">
        Hẹn Hò Nhưng Không Yêu
      </h1>

      <p className={styles.description}>
        Relationship Finite State Machine
      </p>

      <output
        className={styles.status}
        role="status"
        aria-live="polite"
      >
        Trạng thái hiện tại: {phaseLabels[state.phase]}
      </output>

      <p className={styles.note}>
        FSM đã được tích hợp. Các nút tương tác sẽ được
        bổ sung trong bước tiếp theo.
      </p>
    </article>
  )
}
