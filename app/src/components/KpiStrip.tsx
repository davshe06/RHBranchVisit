import type { Branch, MetricKey } from '../data';
import { kpiList } from '../data';
import styles from './KpiStrip.module.css';

interface KpiStripProps {
  branch: Branch;
  onOpenMetric: (metric: MetricKey) => void;
}

export function KpiStrip({ branch, onOpenMetric }: KpiStripProps) {
  return (
    <section className={styles.strip} aria-label="Branch KPIs">
      {kpiList(branch).map((k) => (
        <button key={k.label} type="button" className={styles.kpi} onClick={() => onOpenMetric(k.metric)}>
          <span className={styles.label}>{k.label}</span>
          <span className={styles.value}>{k.value}</span>
          <div className={styles.row}>
            <span className={styles.delta} style={{ color: k.color }}>
              {k.delta}
            </span>
            {/* Sparkline geometry is fixed at 60×19 by the handoff. */}
            <svg width="60" height="19" viewBox="0 0 60 19" aria-hidden focusable="false">
              <path d={k.spark} fill="none" stroke={k.color} strokeWidth="1.4" />
            </svg>
          </div>
          <span className={styles.sub}>{k.sub}</span>
        </button>
      ))}
    </section>
  );
}
