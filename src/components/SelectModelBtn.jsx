import { useEffect, useId, useRef, useState } from 'react';
import ModelMenu from './ModelMenu';
import { getModelList } from '../utils/modelList';
import styles from './SelectModelBtn.module.css';

export default function SelectModelBtn({ selectedModel, onSelectModel }) {
  const [open, setOpen] = useState(false);
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState({ kind: '', sequence: 0 });
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);
  const requestRef = useRef(null);
  const menuId = useId();

  const closeMenu = () => {
    requestRef.current?.abort();
    requestRef.current = null;
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const handleOutside = (event) => {
      if (!wrapperRef.current?.contains(event.target)) {
        requestRef.current?.abort();
        requestRef.current = null;
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [open]);

  useEffect(() => () => requestRef.current?.abort(), []);

  const openMenu = async () => {
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    setModels([]);
    setError('');
    setLoading(true);
    setOpen(true);

    try {
      const availableModels = await getModelList(controller.signal);
      if (requestRef.current !== controller) return;
      setModels(availableModels);
    } catch (error) {
      if (controller.signal.aborted || requestRef.current !== controller) return;
      setError(error.message);
      setFeedback((current) => ({ kind: 'failure', sequence: current.sequence + 1 }));
    } finally {
      if (requestRef.current === controller) {
        setLoading(false);
        requestRef.current = null;
      }
    }
  };

  const selectModel = (model) => {
    onSelectModel(model);
    setFeedback((current) => ({ kind: 'success', sequence: current.sequence + 1 }));
    closeMenu();
    buttonRef.current?.focus();
  };

  const label = feedback.kind === 'failure' ? 'Model failed' : selectedModel || 'Select model';

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) closeMenu();
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) {
          event.preventDefault();
          event.stopPropagation();
          closeMenu();
          buttonRef.current?.focus();
        }
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`${styles.selectModelBtn} ${styles[feedback.kind] || ''}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        title={selectedModel ? `Active model: ${selectedModel}` : 'Select model'}
        onClick={() => open ? closeMenu() : openMenu()}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            if (!open) openMenu();
          }
        }}
      >
        {feedback.kind && <span key={feedback.sequence} className={styles.sheen} aria-hidden="true" />}
        <span className={styles.label}>{label}</span>
        <svg className={styles.chevron} viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="m4 10 4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {open && (
        <ModelMenu
          id={menuId}
          models={models}
          loading={loading}
          error={error}
          selectedModel={selectedModel}
          onSelect={selectModel}
        />
      )}
    </div>
  );
}
