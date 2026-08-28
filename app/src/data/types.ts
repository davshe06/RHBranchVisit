/*
 * The CRM seam.
 *
 * These shapes are what a real branch-data adapter has to produce. Everything
 * downstream (flags, talking points, cell colouring, chart series) is derived
 * from them in `derive.ts` — no view code reaches past this boundary. Swapping
 * `MockBranchRepository` for a live implementation of `BranchRepository` is the
 * whole integration.
 */

/** Which side of the desk someone sits on. Drives the CVs column and avatar colour. */
export type Track = 'sales' | 'recruiting';

/** A single consultant's desk, as the CRM would return it. */
export interface Consultant {
  id: string;
  name: string;
  /** Display title, e.g. "Practice Director, Sales". */
  role: string;
  track: Track;
  /** Human-readable tenure, e.g. "6 yr" / "8 mo". */
  tenure: string;
  /** Optional lifecycle marker, e.g. "Ramping" / "Rookie". */
  badge?: string;

  jobOrders: {
    active: number;
    open: number;
  };

  placements: {
    /** Whole percent, e.g. 34 for 34%. */
    closeRatioPct: number;
    startsNext30: number;
    endsNext30: number;
    /** How many of `endsNext30` already have a backfill in play. */
    backfilled: number;
  };

  /** Trailing-30-day activity counts. */
  activity: {
    connects: number;
    /** Recruiting-track only; `null` on a sales desk (renders as an em dash). */
    candidateVisits: number | null;
    interviews: number;
    submittals: number;
    /** In-person client meetings. */
    clientMeetings: number;
  };

  momentum: {
    momPct: number;
    qoqPct: number;
  };
}

/** Trailing-30-day activity a desk is expected to clear. */
export interface ActivityExpectations {
  connects: number;
  candidateVisits: number;
  interviews: number;
  submittals: number;
  clientMeetings: number;
}

/** The four series behind the trend chart and the metric drill. */
export type MetricKey = 'close' | 'active' | 'subs' | 'starts';

export interface MetricSeries {
  label: string;
  /** Suffix appended to axis and headline values, e.g. "%" or "". */
  unit: string;
  /** 12 points, oldest first, aligned to `MONTHS`. */
  current: number[];
  /** Same 12 months, prior year. */
  prior: number[];
  /** Same 12 months, peer-average. */
  peer: number[];
}

export interface Brief {
  headline: string;
  body: string;
}

export type ActionState = 'pending' | 'approved' | 'skipped';

export interface ProposedAction {
  id: string;
  title: string;
  body: string;
}

/** A canned question and its answer for the "Ask about this branch" rail. */
export interface AskPair {
  question: string;
  answer: string;
}

/** What the branch selector needs before a branch is loaded. */
export interface BranchSummary {
  id: string;
  /** e.g. "Charlotte". */
  name: string;
  /** e.g. "Finance & Accounting". */
  specialty: string;
  /** The selector's option text: "Charlotte — Finance & Accounting". */
  label: string;
}

/** KPI deltas and sub-labels are editorial, not derivable, so the CRM supplies them. */
export interface KpiCopy {
  activeDelta: string;
  activeSub: string;
  openDelta: string;
  openSub: string;
  closeDelta: string;
  startsDelta: string;
  startsSub: string;
  endsSub: string;
  subsDelta: string;
  subsSub: string;
  /** Six-point sparks for the two KPIs with no 12-month series behind them. */
  openSpark: number[];
  endsSpark: number[];
}

export interface Branch extends BranchSummary {
  visitDate: string;
  syncedAt: string;
  /** Short sync time shown in the mobile hero, e.g. "06:12". */
  syncedTime: string;
  closeRatioBenchmark: number;
  expectations: ActivityExpectations;
  desks: Consultant[];
  series: Record<MetricKey, MetricSeries>;
  brief: Brief;
  actions: ProposedAction[];
  askPairs: AskPair[];
  kpiCopy: KpiCopy;
  /** Opening line of the desktop Ask thread. */
  askGreeting: string;
  /** The mobile Ask screen's scripted thread. */
  mobileThread: { who: 'assistant' | 'user'; text: string }[];
}

/**
 * The integration point. A live version fetches from the branch data warehouse;
 * everything above this line stays unchanged.
 */
export interface BranchRepository {
  listBranches(): Promise<BranchSummary[]>;
  getBranch(id: string): Promise<Branch>;
}

/** Month labels for every 12-point series. */
export const MONTHS = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'] as const;
