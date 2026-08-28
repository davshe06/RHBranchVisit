import { useState } from 'react';
import { Card, CardKicker } from './Card';
import type { Branch, Consultant, MetricKey } from '../data';
import { NEG, POS, avatarBg, flagList, initials, kpiList, pct } from '../data';
import styles from './MobileWorkspace.module.css';

type Screen = 'brief' | 'desks' | 'ask';

const SCREENS: { key: Screen; label: string }[] = [
  { key: 'brief', label: 'Brief' },
  { key: 'desks', label: 'Desks' },
  { key: 'ask', label: 'Ask' },
];

interface MobileWorkspaceProps {
  branch: Branch;
  onOpenPerson: (c: Consultant) => void;
  onOpenMetric: (m: MetricKey) => void;
  /** True when shown on a wide screen via the preview toggle. */
  preview: boolean;
}

/*
 * The mobile read, rendered at the real breakpoint. The prototype drew three
 * fake phone frames side by side; these are the same three screens as an
 * actual responsive layout with tab navigation.
 */
export function MobileWorkspace({ branch, onOpenPerson, onOpenMetric, preview }: MobileWorkspaceProps) {
  const [screen, setScreen] = useState<Screen>('brief');

  return (
    <div className={[styles.shell, preview ? styles.previewShell : ''].filter(Boolean).join(' ')}>
      <nav className={styles.tabs} role="tablist" aria-label="Mobile screens">
        {SCREENS.map((s) => (
          <button
            key={s.key}
            type="button"
            role="tab"
            aria-selected={screen === s.key}
            className={[styles.tab, screen === s.key ? styles.tabOn : ''].filter(Boolean).join(' ')}
            onClick={() => setScreen(s.key)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      {screen === 'brief' && <BriefScreen branch={branch} onOpenPerson={onOpenPerson} onOpenMetric={onOpenMetric} />}
      {screen === 'desks' && <DesksScreen branch={branch} onOpenPerson={onOpenPerson} />}
      {screen === 'ask' && <AskScreen branch={branch} />}
    </div>
  );
}

function BriefScreen({
  branch,
  onOpenPerson,
  onOpenMetric,
}: {
  branch: Branch;
  onOpenPerson: (c: Consultant) => void;
  onOpenMetric: (m: MetricKey) => void;
}) {
  const flags = flagList(branch);
  // The mobile strip shows four of the six KPIs — the ones that fit a glance.
  const kpis = kpiList(branch).filter((k) => k.label !== 'Open JOs' && k.label !== 'Submittals');

  return (
    <div className={styles.screen}>
      <div className={styles.hero}>
        <span className={styles.heroKicker}>Branch visit · {branch.visitDate}</span>
        <span className={styles.heroTitle}>{branch.name}</span>
        <span className={styles.heroMeta}>
          {branch.specialty} · {branch.desks.length} desks · synced {branch.syncedTime}
        </span>
      </div>

      <Card padding="14px 15px" gap={9}>
        <CardKicker>The brief</CardKicker>
        <h2 className={styles.headline}>{branch.brief.headline}</h2>
        <p className={styles.briefBody}>{branch.brief.body}</p>
      </Card>

      <div className={styles.kpiGrid}>
        {kpis.map((k) => (
          <button key={k.label} type="button" className={styles.kpi} onClick={() => onOpenMetric(k.metric)}>
            <span className={styles.kpiLabel}>{k.label}</span>
            <span className={styles.kpiValue}>{k.value}</span>
            <span className={styles.kpiDelta} style={{ color: k.color }}>
              {k.delta}
            </span>
          </button>
        ))}
      </div>

      <Card padding="14px 15px" gap={9}>
        <CardKicker>Flags · {flags.length}</CardKicker>
        {flags.map((f, i) => (
          <button
            key={`${f.who}-${f.label}-${i}`}
            type="button"
            className={[styles.flag, i ? styles.flagDivider : ''].filter(Boolean).join(' ')}
            style={{ borderLeftColor: f.color }}
            onClick={() => onOpenPerson(f.consultant)}
          >
            <span className={styles.flagLabel}>{f.label}</span>
            <span className={styles.flagWho}>{f.who}</span>
          </button>
        ))}
      </Card>

      <Card padding="14px 15px" gap={9}>
        <CardKicker>Proposed actions</CardKicker>
        {branch.actions.map((a, i) => (
          <div key={a.id} className={[styles.action, i ? styles.flagDivider : ''].filter(Boolean).join(' ')}>
            <span className={styles.actionTitle}>{a.title}</span>
            <span className={styles.actionBody}>{a.body}</span>
          </div>
        ))}
      </Card>

      <button type="button" className={styles.fullButton}>
        Open full branch data
      </button>
    </div>
  );
}

function DesksScreen({ branch, onOpenPerson }: { branch: Branch; onOpenPerson: (c: Consultant) => void }) {
  // Lowest close ratio first — the desks that need the visit.
  const ranked = [...branch.desks].sort((a, b) => a.placements.closeRatioPct - b.placements.closeRatioPct);
  const bench = branch.closeRatioBenchmark;

  return (
    <div className={styles.screen}>
      <div className={styles.subhead}>
        <span className={styles.subheadTitle}>Desks</span>
        <span className={styles.subheadMeta}>sorted by close ratio, lowest first</span>
      </div>
      {ranked.map((p) => {
        const cr = p.placements.closeRatioPct;
        const color = cr < bench - 4 ? NEG : cr >= bench + 4 ? POS : undefined;
        return (
          <button key={p.id} type="button" className={styles.deskCard} onClick={() => onOpenPerson(p)}>
            <div className={styles.deskHead}>
              <span className={styles.avatar} style={{ background: avatarBg(p) }} aria-hidden>
                {initials(p.name)}
              </span>
              <span className={styles.deskNames}>
                <span className={styles.deskName}>{p.name}</span>
                <span className={styles.deskRole}>{p.role}</span>
              </span>
              <span className={styles.deskRatio} style={{ color }}>
                {cr}%
              </span>
            </div>
            <div className={styles.deskStats}>
              <span>
                JOs <b>{p.jobOrders.active}</b>
              </span>
              <span>
                Subs <b>{p.activity.submittals}</b>
              </span>
              <span>
                Starts <b>{p.placements.startsNext30}</b>
              </span>
              <span>
                Ends <b>{p.placements.endsNext30}</b>
              </span>
              <span>
                MoM <b>{pct(p.momentum.momPct)}</b>
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function AskScreen({ branch }: { branch: Branch }) {
  const [draft, setDraft] = useState('');
  const [thread, setThread] = useState(branch.mobileThread);

  const ask = (question: string) => {
    const match = branch.askPairs.find((p) => p.question.toLowerCase() === question.toLowerCase());
    setThread((prev) => [
      ...prev,
      { who: 'user' as const, text: question },
      {
        who: 'assistant' as const,
        text:
          match?.answer ??
          'Pulling that from the CRM now. In the shipped version this routes to the branch data warehouse and returns a figure with its source records attached.',
      },
    ]);
    setDraft('');
  };

  return (
    <div className={`${styles.screen} ${styles.askScreen}`}>
      <div className={styles.subhead} style={{ margin: 0 }}>
        <span className={styles.subheadTitle}>Ask</span>
      </div>
      <div className={styles.askThread} role="log" aria-label="Branch questions">
        {thread.map((m, i) => (
          <div key={i} className={[styles.bubble, m.who === 'user' ? styles.bubbleUser : ''].filter(Boolean).join(' ')}>
            {m.text}
          </div>
        ))}
      </div>
      <form
        className={styles.askComposer}
        onSubmit={(e) => {
          e.preventDefault();
          if (draft.trim()) ask(draft.trim());
        }}
      >
        <label className="srOnly" htmlFor="mobile-ask">
          Ask about this branch
        </label>
        <input
          id="mobile-ask"
          className={styles.input}
          placeholder="Ask about this branch…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
        />
        <button type="submit" className={styles.send}>
          Send
        </button>
      </form>
    </div>
  );
}
