import { useState } from 'react';
import { RotateCw } from 'lucide-react';
import { Card, CardKicker } from './Card';
import type { Branch, Consultant } from '../data';
import { flagList } from '../data';
import styles from './BriefCard.module.css';

interface BriefCardProps {
  branch: Branch;
  onOpenPerson: (c: Consultant) => void;
}

export function BriefCard({ branch, onOpenPerson }: BriefCardProps) {
  const [spinning, setSpinning] = useState(false);
  const flags = flagList(branch);

  return (
    <Card padding="19px 21px" gap={13}>
      <div className={styles.head}>
        <CardKicker>Prep brief · {branch.label}</CardKicker>
        <span className={styles.meta}>
          Visit {branch.visitDate} · CRM synced {branch.syncedAt}
        </span>
        <button
          type="button"
          className={styles.regen}
          onClick={() => {
            setSpinning(true);
            window.setTimeout(() => setSpinning(false), 620);
          }}
        >
          <RotateCw size={14} strokeWidth={1.5} className={spinning ? styles.spin : undefined} aria-hidden />
          Regenerate
        </button>
      </div>
      <h2 className={styles.headline}>{branch.brief.headline}</h2>
      <p className={styles.body}>{branch.brief.body}</p>
      <div className={styles.flags}>
        {flags.map((f, i) => (
          <button
            key={`${f.who}-${f.label}-${i}`}
            type="button"
            className={styles.flag}
            style={{ borderLeft: `3px solid ${f.color}` }}
            onClick={() => onOpenPerson(f.consultant)}
          >
            <span className={styles.flagLabel}>{f.label}</span>
            <span className={styles.flagWho}>{f.who}</span>
          </button>
        ))}
      </div>
    </Card>
  );
}
