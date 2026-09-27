import styles from './HaltBtn.module.css';

export default function HaltBtn({ onClick, disabled }) {
  return (
    <button
      type="button"
      className={styles.haltBtn}
      onClick={onClick}
      disabled={disabled}
      aria-label="Stop generating"
    >
      <span className={styles.square} />
    </button>
  );
}
