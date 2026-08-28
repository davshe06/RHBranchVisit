import { useEffect, useRef } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Card, CardKicker } from './Card';
import type { Branch, Consultant, MetricKey } from '../data';
import { METRIC_FIELD, MONTHS, NEG, POS, linePath, talkingPoints } from '../data';
import styles from './DrillPanel.module.css';

/** What the panel is showing. `from` carries the trail back to the previous view. */
export type Drill =
  | { type: 'person'; consultant: Consultant; from?: Drill }
  | { type: 'metric'; metric: MetricKey; from?: Drill };

interface DrillPanelProps {
  branch: Branch;
  drill: Drill;
  onNavigate: (drill: Drill) => void;
  onClose: () => void;
}

export function DrillPanel({ branch, drill, onNavigate, onClose }: DrillPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Escape closes; focus moves into the panel and is trapped while it is open.
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const kicker = drill.type === 'person' ? 'Desk detail' : 'Metric detail';
  const title = drill.type === 'person' ? drill.consultant.name : branch.series[drill.metric].label;

  return (
    <>
      <button className={styles.backdrop} onClick={onClose} aria-label="Close detail" tabIndex={-1} />
      <div
        className={`${styles.panel} onDark`}
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${kicker}: ${title}`}
      >
        <div className={styles.header}>
          {drill.from && (
            <button
              type="button"
              className={styles.back}
              onClick={() => drill.from && onNavigate(drill.from)}
              aria-label="Back"
            >
              <ArrowLeft size={16} strokeWidth={1.5} aria-hidden />
            </button>
          )}
          <div className={styles.titles}>
            <span className={styles.kicker}>{kicker}</span>
            <span className={styles.title}>{title}</span>
          </div>
          <button
            type="button"
            ref={closeRef}
            className={`${styles.back} ${styles.close}`}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={16} strokeWidth={1.5} aria-hidden />
          </button>
        </div>
        <div className={styles.body}>
          {drill.type === 'person' ? (
            <PersonBody branch={branch} consultant={drill.consultant} />
          ) : (
            <MetricBody branch={branch} metric={drill.metric} onOpenPerson={(c) => onNavigate({ type: 'person', consultant: c, from: drill })} />
          )}
        </div>
      </div>
    </>
  );
}

// ── person variant ─────────────────────────────────────────────────────────

function PersonBody({ branch, consultant: c }: { branch: Branch; consultant: Consultant }) {
  const bench = branch.closeRatioBenchmark;
  const exp = branch.expectations;
  const mini: [string, string | number][] = [
    ['Active JOs', c.jobOrders.active],
    ['Open JOs', c.jobOrders.open],
    ['Close ratio', `${c.placements.closeRatioPct}%`],
    ['Starts 30d', c.placements.startsNext30],
    ['Ends 30d', c.placements.endsNext30],
    ['Backfilled', c.placements.backfilled],
  ];

  // CVs are a recruiting measure; a sales desk drops the row entirely.
  const activity: [string, number, number][] = [
    ['Connects', c.activity.connects, exp.connects],
    ...(c.activity.candidateVisits !== null
      ? ([['CVs', c.activity.candidateVisits, exp.candidateVisits]] as [string, number, number][])
      : []),
    ['Interviews', c.activity.interviews, exp.interviews],
    ['Submittals', c.activity.submittals, exp.submittals],
    ['ICMs', c.activity.clientMeetings, exp.clientMeetings],
  ];

  // The desk's close-ratio line is the branch series offset to this desk's level.
  const offset = c.placements.closeRatioPct - bench;
  const deskLine = branch.series.close.current.map((v) => v + offset);
  const benchY = 110 - ((bench - 10) / 32) * 96;

  return (
    <>
      <Card padding="15px 16px" gap={10}>
        <CardKicker>
          {c.role} · {c.tenure} tenure
        </CardKicker>
        <div className={styles.miniGrid}>
          {mini.map(([label, value]) => (
            <div key={label}>
              <div className={styles.miniLabel}>{label}</div>
              <div className={styles.miniValue}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card padding="15px 16px" gap={10}>
        <CardKicker>Activity vs expected range · trailing 30 days</CardKicker>
        {activity.map(([label, value, expected]) => {
          const width = Math.min(value / (expected * 1.6), 1) * 100;
          const ok = value >= expected;
          return (
            <div key={label} className={styles.activityRow}>
              <span className={styles.activityLabel}>{label}</span>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${width}%`, background: ok ? POS : NEG }} />
                {/* Expected sits at 1/1.6 of the track, by the handoff's scale. */}
                <div className={styles.marker} style={{ left: `${(1 / 1.6) * 100}%` }} />
              </div>
              <span className={styles.activityValue} style={{ color: ok ? POS : NEG }}>
                {value} / {expected}
              </span>
            </div>
          );
        })}
      </Card>

      <Card padding="15px 16px" gap={10}>
        <CardKicker>Close ratio · rolling 12 months</CardKicker>
        <svg viewBox="0 0 520 130" style={{ width: '100%', height: 130 }} role="img" aria-label={`${c.name} close ratio over twelve months against a ${bench}% benchmark`}>
          <path d={linePath(deskLine, 20, 500, 14, 110, 10, 42)} fill="none" stroke="var(--color-accent)" strokeWidth="2.2" />
          <path d={linePath(branch.series.close.peer, 20, 500, 14, 110, 10, 42)} fill="none" stroke="var(--chart-prior)" strokeWidth="1.5" strokeDasharray="5 4" />
          <line x1="20" x2="500" y1={benchY} y2={benchY} stroke="var(--warn)" strokeWidth="1" />
          <text x="500" y={benchY - 5} textAnchor="end" fontSize="10" fill="var(--warn)" fontFamily="Barlow">
            benchmark {bench}%
          </text>
          {MONTHS.map((m, i) => (
            <text key={m} x={20 + i * (480 / 11)} y="126" textAnchor="middle" fontSize="9.5" fill="var(--chart-axis-label)" fontFamily="Barlow">
              {m}
            </text>
          ))}
        </svg>
      </Card>

      <Card padding="15px 16px" gap={10}>
        <CardKicker>Talking points</CardKicker>
        <ul className={styles.points}>
          {talkingPoints(c, bench, exp).map((t, i) => (
            <li key={i}>{t}</li>
          ))}
        </ul>
      </Card>
    </>
  );
}

// ── metric variant ─────────────────────────────────────────────────────────

function MetricBody({
  branch,
  metric,
  onOpenPerson,
}: {
  branch: Branch;
  metric: MetricKey;
  onOpenPerson: (c: Consultant) => void;
}) {
  const s = branch.series[metric];
  const field = METRIC_FIELD[metric];
  const ranked = [...branch.desks].sort((a, b) => field(b) - field(a));
  const max = Math.max(...ranked.map(field));
  const min = Math.min(...s.current) * 0.9;
  const top = Math.max(...s.current) * 1.05;

  return (
    <>
      <Card padding="15px 16px" gap={11}>
        <CardKicker>Branch trend · rolling 12 months</CardKicker>
        <svg viewBox="0 0 520 140" style={{ width: '100%', height: 140 }} role="img" aria-label={`${s.label} over twelve months against prior year`}>
          <path d={linePath(s.current, 20, 500, 14, 116, min, top)} fill="none" stroke="var(--color-accent)" strokeWidth="2.2" />
          <path d={linePath(s.prior, 20, 500, 14, 116, min, top)} fill="none" stroke="var(--chart-prior)" strokeWidth="1.5" strokeDasharray="5 4" />
          {MONTHS.map((m, i) => (
            <text key={m} x={20 + i * (480 / 11)} y="134" textAnchor="middle" fontSize="9.5" fill="var(--chart-axis-label)" fontFamily="Barlow">
              {m}
            </text>
          ))}
        </svg>
      </Card>

      <Card padding="15px 16px" gap={11}>
        <CardKicker>{s.label} by desk</CardKicker>
        {ranked.map((p) => (
          <button key={p.id} type="button" className={styles.rankRow} onClick={() => onOpenPerson(p)}>
            <span className={styles.rankName}>{p.name}</span>
            <div className={styles.rankTrack}>
              <div className={styles.rankFill} style={{ width: `${(field(p) / max) * 100}%` }} />
            </div>
            <span className={styles.rankValue}>
              {field(p)}
              {metric === 'close' ? '%' : ''}
            </span>
          </button>
        ))}
      </Card>
    </>
  );
}
