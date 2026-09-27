import styles from './SubmitBtn.module.css';

export default function SubmitBtn({ onClick, disabled }) {
  return (
    <button
      type="button"
      className={styles.submitBtn}
      onClick={onClick}
      disabled={disabled}
      aria-label="Submit prompt"
    >
      <svg viewBox="0 0 24 24" className={styles.icon} aria-hidden="true">
        <path
          d="M12 19V5M12 5L6 11M12 5l6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </button>
  );
}
