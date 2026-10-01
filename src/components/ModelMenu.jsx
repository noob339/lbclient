import { useEffect, useRef } from 'react';
import { getModelSource } from '../utils/modelList';
import styles from './ModelMenu.module.css';

export default function ModelMenu({ id, models, loading, error, selectedModel, onSelect }) {
  const menuRef = useRef(null);
  const optionRefs = useRef([]);

  useEffect(() => {
    const selectedIndex = Math.max(0, models.findIndex(({ name }) => name === selectedModel));
    (optionRefs.current[selectedIndex] ?? menuRef.current)?.focus();
  }, [models, selectedModel]);

  const handleKeyDown = (event) => {
    if (!models.length) return;
    const current = optionRefs.current.indexOf(document.activeElement);
    let next;

    switch (event.key) {
      case 'ArrowDown': next = (current + 1) % models.length; break;
      case 'ArrowUp': next = (current - 1 + models.length) % models.length; break;
      case 'Home': next = 0; break;
      case 'End': next = models.length - 1; break;
      default: return;
    }

    event.preventDefault();
    optionRefs.current[next]?.focus();
  };

  return (
    <div className={styles.panel}>
      <p className={styles.heading}>Choose a model</p>
      {selectedModel && <p className={styles.activeModel}>Active: {selectedModel}</p>}
      <div
        id={id}
        ref={menuRef}
        role="menu"
        aria-label="Available models"
        aria-busy={loading}
        tabIndex={-1}
        className={styles.menu}
        onKeyDown={handleKeyDown}
      >
        {loading && <p className={styles.notice} role="status">Getting models…</p>}
        {error && <p className={styles.error} role="alert">{error} Close and reopen to try again.</p>}
        {!loading && !error && models.length === 0 && (
          <p className={styles.notice} role="status">No models available.</p>
        )}
        {models.map((model, index) => {
          const source = getModelSource(model);
          return (
            <button
              key={model.name}
              ref={(element) => { optionRefs.current[index] = element; }}
              type="button"
              role="menuitemradio"
              aria-checked={model.name === selectedModel}
              aria-label={source ? `${model.name}, based on ${source}` : model.name}
              tabIndex={-1}
              className={styles.option}
              onMouseEnter={(event) => event.currentTarget.focus({ preventScroll: true })}
              onClick={() => onSelect(model.name)}
            >
              <span className={styles.modelDetails}>
                <span className={styles.modelName}>{model.name}</span>
                {source && (
                  <span className={styles.source}>
                    <span className={styles.sourceArrow} aria-hidden="true">↳</span>
                    <span>{source}</span>
                  </span>
                )}
              </span>
              {model.name === selectedModel && <span aria-hidden="true">✓</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
