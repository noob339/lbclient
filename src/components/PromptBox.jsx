import styles from './PromptBox.module.css';
import HaltBtn from './HaltBtn';
import SubmitBtn from './SubmitBtn';

export default function PromptBox({
  prompt,
  setPrompt,
  onSubmit,
  onHalt,
  querying,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className={styles.promptBox}>
      <textarea
        className={styles.textarea}
        placeholder="Message LadyBug…"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
      />

      <div className={styles.controls}>
        <HaltBtn onClick={onHalt} disabled={!querying} />
        <SubmitBtn onClick={onSubmit} disabled={querying || !prompt.trim()} />
      </div>
    </div>
  );
}
