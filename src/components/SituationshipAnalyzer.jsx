import styles from './SituationshipAnalyzer.module.css'

export default function SituationshipAnalyzer() {
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
        Step 1: Project skeleton ready.
      </output>

      <p className={styles.note}>
        FSM, Effort Reducer và Ghosting Timer
        sẽ được triển khai ở các bước tiếp theo.
      </p>
    </article>
  )
}
