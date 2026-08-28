import styles from './Pill.module.css';

interface PillProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** Renders the group as a radio set for assistive tech. */
  role?: 'radio' | 'tab';
}

export function Pill({ label, selected, onClick, role = 'radio' }: PillProps) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={role === 'radio' ? selected : undefined}
      aria-selected={role === 'tab' ? selected : undefined}
      className={[styles.pill, selected ? styles.on : ''].filter(Boolean).join(' ')}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
