import type {
  ActivityExpectations,
  Branch,
  Consultant,
  MetricKey,
  MetricSeries,
} from './types';
import { MONTHS } from './types';

/*
 * Every derived value in the workspace. The rules here are transcribed from the
 * prototype one for one — thresholds, colours, wording and chart geometry all
 * match. Nothing in here reaches for a colour that is not a data colour.
 */

export const POS = '#1f7a52';
export const NEG = '#c0392b';
export const WARN = '#b57612';
export const ACCENT = '#0c6ca8';
export const MUTED = '#5f7183';

export const pct = (v: number) => `${v > 0 ? '+' : ''}${v}%`;

export const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');

/** Avatar fill: blue for sales desks, slate for recruiting. */
export const avatarBg = (c: Consultant) => (c.track === 'sales' ? ACCENT : MUTED);

// ── flags ──────────────────────────────────────────────────────────────────

export type FlagTone = 'negative' | 'warning' | 'positive' | 'info';

export interface Flag {
  label: string;
  who: string;
  tone: FlagTone;
  color: string;
  consultant: Consultant;
}

const TONE_COLOR: Record<FlagTone, string> = {
  negative: NEG,
  warning: WARN,
  positive: POS,
  info: ACCENT,
};

/**
 * Flag rules, in the prototype's order. Each rule sweeps the whole floor before
 * the next one runs, so flags group by kind rather than by person, and the list
 * is capped at seven.
 */
export function flagList(branch: Branch): Flag[] {
  const { desks, closeRatioBenchmark: bench, expectations: exp } = branch;
  const out: Flag[] = [];
  const push = (c: Consultant, label: string, tone: FlagTone) =>
    out.push({ label, who: c.name, tone, color: TONE_COLOR[tone], consultant: c });

  // 1. Conversion more than four points under benchmark.
  desks
    .filter((c) => c.placements.closeRatioPct < bench - 4)
    .forEach((c) => push(c, `Close ratio ${c.placements.closeRatioPct}% vs ${bench}% benchmark`, 'negative'));

  // 2. Submittals under 85% of expected, or client meetings under 70%.
  desks
    .filter((c) => c.activity.submittals < exp.submittals * 0.85 || c.activity.clientMeetings < exp.clientMeetings * 0.7)
    .forEach((c) => push(c, 'Activity below expected range', 'warning'));

  // 3. Three or more upcoming ends with no backfill in play.
  desks
    .filter((c) => c.placements.endsNext30 - c.placements.backfilled >= 3)
    .forEach((c) => push(c, `${c.placements.endsNext30 - c.placements.backfilled} ends not backfilled`, 'negative'));

  // 4. A month-on-month swing of 20 points or more, either direction.
  desks
    .filter((c) => Math.abs(c.momentum.momPct) >= 20)
    .forEach((c) => push(c, `${pct(c.momentum.momPct)} MoM swing`, c.momentum.momPct > 0 ? 'positive' : 'negative'));

  // 5. Anyone carrying a lifecycle badge.
  desks.filter((c) => c.badge).forEach((c) => push(c, `${c.badge} · ${c.tenure} tenure`, 'info'));

  return out.slice(0, 7);
}

// ── desk table ─────────────────────────────────────────────────────────────

export interface Cell {
  value: string | number;
  /** Data colour, or undefined to inherit the row colour. */
  color?: string;
  weight: 400 | 500;
}

export const TABLE_COLUMNS = [
  { label: 'Active', key: 'aj' },
  { label: 'Open', key: 'oj' },
  { label: 'Close %', key: 'cr' },
  { label: 'Starts', key: 'st' },
  { label: 'Ends (open)', key: 'en' },
  { label: 'Conn', key: 'cn' },
  { label: 'CVs', key: 'cv' },
  { label: 'Intvw', key: 'iv' },
  { label: 'Subs', key: 'sb' },
  { label: 'ICMs', key: 'ic' },
  { label: 'MoM', key: 'mom' },
] as const;

export type SortKey = (typeof TABLE_COLUMNS)[number]['key'];

/**
 * Cell colouring. A value is red when it falls under the expected range and
 * green only where the prototype greens it: close ratio well over benchmark,
 * and a positive MoM.
 */
export function cellsFor(c: Consultant, bench: number, exp: ActivityExpectations): Cell[] {
  const cell = (value: string | number, color?: string, weight: 400 | 500 = 400): Cell => ({ value, color, weight });
  const { jobOrders: j, placements: p, activity: a, momentum: m } = c;
  const unbackfilled = p.endsNext30 - p.backfilled;

  return [
    cell(j.active),
    cell(j.open),
    cell(
      `${p.closeRatioPct}%`,
      p.closeRatioPct >= bench + 4 ? POS : p.closeRatioPct < bench - 4 ? NEG : undefined,
      500,
    ),
    cell(p.startsNext30),
    cell(
      unbackfilled > 0 ? `${p.endsNext30} (${unbackfilled})` : p.endsNext30,
      unbackfilled >= 3 ? NEG : undefined,
    ),
    cell(a.connects, a.connects < exp.connects ? NEG : undefined),
    cell(
      a.candidateVisits ?? '—',
      a.candidateVisits !== null && a.candidateVisits < exp.candidateVisits ? NEG : undefined,
    ),
    cell(a.interviews, a.interviews < exp.interviews ? NEG : undefined),
    cell(a.submittals, a.submittals < exp.submittals ? NEG : undefined),
    cell(a.clientMeetings, a.clientMeetings < exp.clientMeetings ? NEG : undefined),
    cell(pct(m.momPct), m.momPct >= 0 ? POS : NEG, 500),
  ];
}

const SORT_VALUE: Record<SortKey, (c: Consultant) => number> = {
  aj: (c) => c.jobOrders.active,
  oj: (c) => c.jobOrders.open,
  cr: (c) => c.placements.closeRatioPct,
  st: (c) => c.placements.startsNext30,
  en: (c) => c.placements.endsNext30,
  cn: (c) => c.activity.connects,
  cv: (c) => c.activity.candidateVisits ?? -1,
  iv: (c) => c.activity.interviews,
  sb: (c) => c.activity.submittals,
  ic: (c) => c.activity.clientMeetings,
  mom: (c) => c.momentum.momPct,
};

export type RoleFilter = 'all' | 'sales' | 'recruiting';

export function visibleDesks(branch: Branch, role: RoleFilter, sort: SortKey): Consultant[] {
  const filtered = branch.desks.filter((c) => role === 'all' || c.track === role);
  const value = SORT_VALUE[sort] ?? SORT_VALUE.cr;
  return [...filtered].sort((a, b) => value(b) - value(a));
}

// ── talking points ─────────────────────────────────────────────────────────

export function talkingPoints(c: Consultant, bench: number, exp: ActivityExpectations): string[] {
  const out: string[] = [];
  const { placements: p, activity: a, momentum: m } = c;
  const unbackfilled = p.endsNext30 - p.backfilled;

  if (p.closeRatioPct < bench - 4) {
    out.push(
      `Close ratio is ${p.closeRatioPct}% against a ${bench}% benchmark — ${a.submittals} submittals produced ${p.startsNext30} starts. Look at qualification, not volume.`,
    );
  }
  if (p.closeRatioPct >= bench + 4) {
    out.push(
      `Best conversion on the floor at ${p.closeRatioPct}%. Worth asking what the qualification routine looks like so it spreads.`,
    );
  }
  if (unbackfilled > 0) {
    out.push(
      `${unbackfilled} of ${p.endsNext30} upcoming ends have no backfill in play. Redeploy conversations should start this week.`,
    );
  }
  if (a.submittals < exp.submittals) {
    out.push(
      `Submittals at ${a.submittals} against an expected ${exp.submittals}. Connects are ${a.connects}, so activity is going in — it is not coming out the other side.`,
    );
  }
  if (a.clientMeetings < exp.clientMeetings) {
    out.push(`${a.clientMeetings} ICMs against an expected ${exp.clientMeetings}. Client-facing time is the constraint.`);
  }
  if (c.badge) {
    out.push(`${c.badge} at ${c.tenure} — measure on activity inputs, not close ratio, for another quarter.`);
  }
  if (Math.abs(m.momPct) >= 20) {
    out.push(`${pct(m.momPct)} month over month. Ask what changed before assuming it holds.`);
  }
  if (!out.length) {
    out.push('Tracking to plan on every measure. Use the time to talk about the desk they want in twelve months.');
  }
  return out;
}

// ── chart maths ────────────────────────────────────────────────────────────

/** Maps a series onto an SVG path across an explicit box and value domain. */
export function linePath(
  values: number[],
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  min: number,
  max: number,
): string {
  const n = values.length;
  const dx = (x1 - x0) / (n - 1);
  const span = max - min || 1;
  return values
    .map((v, i) => `${i ? 'L' : 'M'}${(x0 + i * dx).toFixed(1)} ${(y1 - ((v - min) / span) * (y1 - y0)).toFixed(1)}`)
    .join(' ');
}

/** The 60×19 KPI sparkline, self-scaling to its own min/max. */
export function sparkPath(values: number[]): string {
  const mn = Math.min(...values);
  const mx = Math.max(...values);
  const span = mx - mn || 1;
  return values
    .map((v, i) => `${i ? 'L' : 'M'}${(i * (60 / (values.length - 1))).toFixed(1)} ${(17 - ((v - mn) / span) * 15).toFixed(1)}`)
    .join(' ');
}

export type CompareMode = 'prior' | 'peer';

/** Geometry of the main trend chart, fixed by the prototype's viewBox. */
export const TREND_BOX = { x0: 56, x1: 866, y0: 16, y1: 214, width: 880, height: 248 } as const;

export interface TrendPoint {
  x: string;
  y: string;
  label: string;
  isLatest: boolean;
}

export interface TrendStat {
  label: string;
  value: string;
  color: string;
}

export interface TrendChart {
  latest: string;
  caption: string;
  line: string;
  prior: string;
  area: string;
  yTicks: { y: string; ty: string; label: string }[];
  points: TrendPoint[];
  stats: TrendStat[];
}

export function trendChart(series: MetricSeries, compare: CompareMode, monthLabel: string): TrendChart {
  const cmp = compare === 'prior' ? series.prior : series.peer;
  const all = [...series.current, ...cmp];
  const min = Math.floor(Math.min(...all) * 0.92);
  const max = Math.ceil(Math.max(...all) * 1.04);
  const { x0, x1, y0, y1 } = TREND_BOX;

  const line = linePath(series.current, x0, x1, y0, y1, min, max);
  const dx = (x1 - x0) / 11;
  const last = series.current[11];
  const prevQuarter = series.current[8];
  const prevMonth = series.current[10];
  const cmpLatest = cmp[11];
  const span = max - min || 1;

  return {
    latest: `${last}${series.unit}`,
    caption: `${series.label} · ${monthLabel}`,
    line,
    prior: linePath(cmp, x0, x1, y0, y1, min, max),
    area: `${line} L${x1} ${y1} L${x0} ${y1} Z`,
    yTicks: [0, 1, 2, 3, 4].map((i) => {
      const v = min + (max - min) * (i / 4);
      const y = y1 - (y1 - y0) * (i / 4);
      return { y: y.toFixed(1), ty: (y + 3.5).toFixed(1), label: `${Math.round(v)}${series.unit}` };
    }),
    points: series.current.map((v, i) => ({
      x: (x0 + i * dx).toFixed(1),
      y: (y1 - ((v - min) / span) * (y1 - y0)).toFixed(1),
      label: MONTHS[i],
      isLatest: i === 11,
    })),
    stats: [
      { label: 'MoM', value: pct(Math.round((last / prevMonth - 1) * 100)), color: last >= prevMonth ? POS : NEG },
      { label: 'QoQ', value: pct(Math.round((last / prevQuarter - 1) * 100)), color: last >= prevQuarter ? POS : NEG },
      {
        label: compare === 'prior' ? 'vs last yr' : 'vs peers',
        value: pct(Math.round((last / cmpLatest - 1) * 100)),
        color: last >= cmpLatest ? POS : NEG,
      },
    ],
  };
}

// ── KPI strip ──────────────────────────────────────────────────────────────

export interface Kpi {
  label: string;
  value: string | number;
  delta: string;
  color: string;
  sub: string;
  spark: string;
  metric: MetricKey;
}

export function kpiList(branch: Branch): Kpi[] {
  const t = branch.desks.reduce(
    (acc, c) => ({
      active: acc.active + c.jobOrders.active,
      open: acc.open + c.jobOrders.open,
      starts: acc.starts + c.placements.startsNext30,
      ends: acc.ends + c.placements.endsNext30,
      backfilled: acc.backfilled + c.placements.backfilled,
      submittals: acc.submittals + c.activity.submittals,
    }),
    { active: 0, open: 0, starts: 0, ends: 0, backfilled: 0, submittals: 0 },
  );
  const closeRatio = Math.round(
    branch.desks.reduce((a, c) => a + c.placements.closeRatioPct, 0) / branch.desks.length,
  );
  const copy = branch.kpiCopy;

  return [
    { label: 'Active JOs', value: t.active, delta: copy.activeDelta, color: POS, sub: copy.activeSub, spark: sparkPath(branch.series.active.current), metric: 'active' },
    { label: 'Open JOs', value: t.open, delta: copy.openDelta, color: WARN, sub: copy.openSub, spark: sparkPath(copy.openSpark), metric: 'active' },
    { label: 'Close ratio', value: `${closeRatio}%`, delta: copy.closeDelta, color: NEG, sub: `benchmark ${branch.closeRatioBenchmark}%`, spark: sparkPath(branch.series.close.current), metric: 'close' },
    { label: 'Upcoming starts', value: t.starts, delta: copy.startsDelta, color: POS, sub: copy.startsSub, spark: sparkPath(branch.series.starts.current), metric: 'starts' },
    { label: 'Upcoming ends', value: t.ends, delta: `${t.ends - t.backfilled} unbackfilled`, color: NEG, sub: copy.endsSub, spark: sparkPath(copy.endsSpark), metric: 'starts' },
    { label: 'Submittals', value: t.submittals, delta: copy.subsDelta, color: POS, sub: copy.subsSub, spark: sparkPath(branch.series.subs.current), metric: 'subs' },
  ];
}

/** Which consultant field a metric ranks desks by, in the metric drill. */
export const METRIC_FIELD: Record<MetricKey, (c: Consultant) => number> = {
  close: (c) => c.placements.closeRatioPct,
  active: (c) => c.jobOrders.active,
  subs: (c) => c.activity.submittals,
  starts: (c) => c.placements.startsNext30,
};
