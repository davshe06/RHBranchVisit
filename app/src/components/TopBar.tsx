import type { BranchSummary } from '../data';
import styles from './TopBar.module.css';

export type ViewMode = 'desktop' | 'mobile';

interface TopBarProps {
  branches: BranchSummary[];
  branchId: string;
  onBranchChange: (id: string) => void;
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  /** Hidden below the mobile breakpoint, where the layout is already mobile. */
  showToggle: boolean;
}

export function TopBar({ branches, branchId, onBranchChange, view, onViewChange, showToggle }: TopBarProps) {
  return (
    <header className={`${styles.bar} onDark`}>
      <div className={styles.brand}>
        {/* Text wordmark stands in until the brand asset is supplied. */}
        <span className={styles.wordmark}>ROBERT HALF</span>
        <span className={styles.placeholder}>logo placeholder</span>
      </div>
      <div className={styles.rule} />
      <div className={styles.titles}>
        <span className={styles.title}>Branch Visit Prep</span>
        <span className={styles.subtitle}>Market Director workspace</span>
      </div>
      <div className={styles.right}>
        <label className="srOnly" htmlFor="branch-select">
          Branch
        </label>
        <select
          id="branch-select"
          className={styles.select}
          value={branchId}
          onChange={(e) => onBranchChange(e.target.value)}
        >
          {branches.map((b) => (
            <option key={b.id} value={b.id}>
              {b.label}
            </option>
          ))}
        </select>
        {showToggle && (
          <div className={styles.toggle} role="tablist" aria-label="Layout preview">
            {(['desktop', 'mobile'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                role="tab"
                aria-selected={view === mode}
                className={[styles.tab, view === mode ? styles.tabOn : ''].filter(Boolean).join(' ')}
                onClick={() => onViewChange(mode)}
              >
                {mode === 'desktop' ? 'Desktop' : 'Mobile'}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
