import type {
  ActivityExpectations,
  AskPair,
  Branch,
  Brief,
  Consultant,
  KpiCopy,
  MetricKey,
  MetricSeries,
  ProposedAction,
  Track,
} from './types';

/*
 * Dummy branch datasets.
 *
 * Charlotte is reproduced verbatim from the prototype — it is the design
 * reference, and its numbers appear throughout the handoff. The other six
 * branches carry their own data: in the prototype the selector was cosmetic
 * and every branch rendered Charlotte.
 */

/** Compact authoring row. Expanded by `desk()` below. */
type DeskRow = [
  name: string,
  role: string,
  track: Track,
  tenure: string,
  activeJos: number,
  openJos: number,
  closeRatioPct: number,
  startsNext30: number,
  endsNext30: number,
  backfilled: number,
  connects: number,
  /** 0 on a sales desk — stored as null, rendered as an em dash. */
  candidateVisits: number,
  interviews: number,
  submittals: number,
  clientMeetings: number,
  momPct: number,
  qoqPct: number,
  badge?: string,
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z]+/g, '-');

function desk(branchId: string, r: DeskRow): Consultant {
  const [name, role, track, tenure, aj, oj, cr, st, en, bf, cn, cv, iv, sb, ic, mom, qoq, badge] = r;
  return {
    id: `${branchId}-${slug(name)}`,
    name,
    role,
    track,
    tenure,
    ...(badge ? { badge } : {}),
    jobOrders: { active: aj, open: oj },
    placements: { closeRatioPct: cr, startsNext30: st, endsNext30: en, backfilled: bf },
    activity: {
      connects: cn,
      candidateVisits: track === 'recruiting' ? cv : null,
      interviews: iv,
      submittals: sb,
      clientMeetings: ic,
    },
    momentum: { momPct: mom, qoqPct: qoq },
  };
}

/*
 * Charlotte's three comparison lines are authored (they came with the
 * prototype). Every other branch derives prior-year and peer-average from its
 * own current line with a fixed ratio plus a stable, seeded wobble, so the
 * dashed comparison line reads as a real series rather than a scaled copy.
 */
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function derived(current: number[], ratio: number, wobble: number, seed: number, integral: boolean) {
  const rnd = seeded(seed);
  return current.map((v) => {
    const out = v * ratio * (1 + (rnd() - 0.5) * wobble);
    return integral ? Math.round(out) : Math.round(out * 10) / 10;
  });
}

function series(
  label: string,
  unit: string,
  current: number[],
  opts: { priorRatio: number; peerRatio: number; seed: number },
): MetricSeries {
  return {
    label,
    unit,
    current,
    prior: derived(current, opts.priorRatio, 0.05, opts.seed, true),
    peer: derived(current, opts.peerRatio, 0.04, opts.seed + 7, true),
  };
}

const DEFAULT_EXPECTATIONS: ActivityExpectations = {
  connects: 130,
  candidateVisits: 85,
  interviews: 12,
  submittals: 18,
  clientMeetings: 6,
};

interface BranchSpec {
  id: string;
  name: string;
  specialty: string;
  visitDate: string;
  syncedAt: string;
  syncedTime: string;
  benchmark: number;
  expectations?: ActivityExpectations;
  rows: DeskRow[];
  series: Record<MetricKey, MetricSeries>;
  brief: Brief;
  actions: ProposedAction[];
  askPairs: AskPair[];
  askGreeting: string;
  kpiCopy: KpiCopy;
  mobileThread: { who: 'assistant' | 'user'; text: string }[];
}

const SPECS: BranchSpec[] = [
  // ── Charlotte — verbatim from the prototype ──────────────────────────────
  {
    id: 'clt',
    name: 'Charlotte',
    specialty: 'Finance & Accounting',
    visitDate: 'Thu 3 Sep 2026',
    syncedAt: 'today 06:12',
    syncedTime: '06:12',
    benchmark: 26,
    rows: [
      ['Dana Whitfield', 'Practice Director, Sales', 'sales', '6 yr', 31, 14, 34, 6, 4, 2, 212, 0, 19, 26, 9, 8, 12],
      ['Marcus Bell', 'Practice Director, Sales', 'sales', '3 yr', 24, 19, 19, 3, 7, 1, 141, 0, 9, 14, 4, -14, -9],
      ['Priya Raman', 'Practice Director, Sales', 'sales', '8 mo', 12, 9, 22, 2, 1, 1, 186, 0, 7, 11, 6, 31, 44, 'Ramping'],
      ['Tom Escobar', 'Practice Director, Sales', 'sales', '11 yr', 28, 11, 31, 5, 3, 3, 97, 0, 14, 21, 7, 2, -3],
      ['Alicia Green', 'Recruiting Manager', 'recruiting', '5 yr', 29, 16, 30, 7, 5, 4, 164, 112, 24, 38, 11, 6, 9],
      ['Jordan Pace', 'Recruiting Manager', 'recruiting', '2 yr', 22, 18, 17, 3, 6, 1, 118, 71, 11, 19, 3, -21, -16],
      ['Sofia Marchetti', 'Recruiter', 'recruiting', '4 mo', 9, 7, 14, 1, 0, 0, 203, 88, 8, 13, 5, 52, 0, 'Rookie'],
      ['Kevin Osei', 'Recruiter', 'recruiting', '3 yr', 26, 12, 27, 4, 2, 2, 151, 96, 18, 29, 8, 4, 6],
      ['Renee Delacroix', 'Recruiter', 'recruiting', '7 yr', 33, 13, 36, 8, 4, 4, 139, 104, 27, 41, 12, 11, 15],
    ],
    series: {
      close: {
        label: 'Close ratio',
        unit: '%',
        current: [24, 26, 25, 27, 29, 28, 26, 24, 23, 25, 27, 26],
        prior: [22, 23, 24, 24, 25, 26, 25, 25, 24, 24, 25, 25],
        peer: [25, 25, 26, 26, 27, 27, 27, 26, 26, 26, 27, 27],
      },
      active: {
        label: 'Active JOs',
        unit: '',
        current: [168, 175, 181, 177, 190, 196, 203, 199, 207, 212, 209, 214],
        prior: [151, 158, 162, 160, 171, 175, 180, 178, 184, 188, 186, 191],
        peer: [160, 164, 168, 170, 178, 182, 186, 185, 190, 193, 192, 196],
      },
      subs: {
        label: 'Submittals',
        unit: '',
        current: [178, 192, 171, 166, 203, 214, 221, 208, 196, 212, 205, 212],
        prior: [165, 171, 158, 151, 182, 190, 196, 188, 180, 186, 184, 188],
        peer: [180, 186, 178, 172, 196, 203, 208, 202, 197, 204, 201, 206],
      },
      starts: {
        label: 'Starts',
        unit: '',
        current: [28, 31, 27, 24, 33, 36, 38, 34, 30, 35, 33, 39],
        prior: [25, 27, 25, 23, 29, 31, 33, 30, 28, 30, 29, 32],
        peer: [27, 29, 27, 25, 31, 33, 34, 32, 30, 32, 31, 34],
      },
    },
    brief: {
      headline: 'Volume is the best it has been all year; conversion is three points off where the branch opened it.',
      body: 'Charlotte holds 214 active JOs against a peer average of 196, and 39 starts land in the next 30 days — the strongest month in the trailing twelve and 22% ahead of last year. Close ratio has drifted from 29% in January to 26%, one point under the peer average, and two desks account for most of the gap. Nineteen of 32 upcoming ends have no backfill in play, which puts the Q4 run rate at risk even if new business holds. Priya Raman and Sofia Marchetti are both inside their first year and should be read on activity inputs rather than conversion for another quarter.',
    },
    actions: [
      {
        id: 'a1',
        title: 'Coaching note — Jordan Pace',
        body: 'Draft a note on interview-to-offer conversion with the six-month submittal trend attached, sent ahead of the 1:1.',
      },
      {
        id: 'a2',
        title: 'Backfill sweep',
        body: 'Flag the 19 unbackfilled ends to the recruiting desks and open redeployment conversations on the 11 finishing inside 14 days.',
      },
      {
        id: 'a3',
        title: 'Recognition — Renee Delacroix',
        body: '36% close ratio on 41 submittals, the highest on the floor. Queue a market-level callout.',
      },
    ],
    askGreeting:
      'Ask me anything about Charlotte — I have Active JOs, close ratio, activity and 12-month trend loaded for all nine desks.',
    askPairs: [
      {
        question: 'Who slipped most this month?',
        answer:
          'Jordan Pace: submittals down 21% MoM and close ratio at 17% against a 26% benchmark. Six ends in the next 30 days with one backfill in play. Marcus Bell is second, down 14% with 19 open JOs and only 14 submittals.',
      },
      {
        question: 'Which open JOs are aging?',
        answer:
          'Eleven open JOs are past 21 days with no submittal. Seven sit on Marcus Bell and Jordan Pace. Two are Priya Raman’s first two direct-hire reqs — likely a coaching conversation, not a pipeline problem.',
      },
      {
        question: 'How does Charlotte compare to peers?',
        answer:
          'Active JOs 214 vs a peer average of 196, so volume is healthy. Close ratio is 26% against a 27% peer average and was 29% in January. The gap is conversion, not demand.',
      },
      {
        question: 'What should I open the meeting with?',
        answer:
          'Lead with starts: 39 this month, the best of the trailing twelve and 22% over last year. Then move to conversion, where the branch has drifted three points below where it opened the year.',
      },
    ],
    kpiCopy: {
      activeDelta: '+9% MoM',
      activeSub: 'peer avg 196',
      openDelta: '11 aged >21d',
      openSub: 'no submittal yet',
      closeDelta: '−1 pt vs peers',
      startsDelta: '+22% YoY',
      startsSub: 'next 30 days',
      endsSub: 'next 30 days',
      subsDelta: '+3% MoM',
      subsSub: 'trailing 30 days',
      openSpark: [132, 128, 134, 129, 125, 119],
      endsSpark: [26, 29, 31, 28, 33, 32],
    },
    mobileThread: [
      { who: 'assistant', text: 'Charlotte is up on volume and down on conversion. Want the two desks driving it?' },
      { who: 'user', text: 'Yes' },
      {
        who: 'assistant',
        text: 'Jordan Pace at 17% and Marcus Bell at 19%, both against a 26% benchmark. Between them they hold 37 open JOs and 13 ends in the next 30 days with two backfills in play.',
      },
      { who: 'user', text: 'What do I say to Jordan?' },
      {
        who: 'assistant',
        text: 'Open on submittals, not close ratio — 19 against an expected 18 means the funnel is filling. The drop is between interview and offer. Ask to sit in on the next debrief.',
      },
    ],
  },
];

export const BRANCH_SPECS = SPECS;
export { DEFAULT_EXPECTATIONS, desk, series, seeded };
export type { BranchSpec, DeskRow };

export function toBranch(spec: BranchSpec): Branch {
  return {
    id: spec.id,
    name: spec.name,
    specialty: spec.specialty,
    label: `${spec.name} — ${spec.specialty}`,
    visitDate: spec.visitDate,
    syncedAt: spec.syncedAt,
    syncedTime: spec.syncedTime,
    closeRatioBenchmark: spec.benchmark,
    expectations: spec.expectations ?? DEFAULT_EXPECTATIONS,
    desks: spec.rows.map((r) => desk(spec.id, r)),
    series: spec.series,
    brief: spec.brief,
    actions: spec.actions,
    askPairs: spec.askPairs,
    kpiCopy: spec.kpiCopy,
    askGreeting: spec.askGreeting,
    mobileThread: spec.mobileThread,
  };
}
