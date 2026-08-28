import { BRANCH_SPECS, toBranch } from './branches';
import { MORE_SPECS } from './branches.more';
import type { Branch, BranchRepository, BranchSummary } from './types';

/*
 * The mock implementation of the CRM seam. Everything the UI sees comes through
 * `BranchRepository`; when real data lands, a live adapter implements the same
 * interface and this file is the only thing that gets swapped.
 *
 * It is deliberately async, so the workspace is already written against a
 * repository that can be slow or fail rather than one that answers instantly.
 */

const ALL = [...BRANCH_SPECS, ...MORE_SPECS].map(toBranch);

const BY_ID = new Map<string, Branch>(ALL.map((b) => [b.id, b]));

export const DEFAULT_BRANCH_ID = 'clt';

export class MockBranchRepository implements BranchRepository {
  /** Simulated latency, in ms. Zero keeps tests and the first paint instant. */
  constructor(private readonly latencyMs = 0) {}

  private delay<T>(value: T): Promise<T> {
    if (this.latencyMs <= 0) return Promise.resolve(value);
    return new Promise((resolve) => setTimeout(() => resolve(value), this.latencyMs));
  }

  listBranches(): Promise<BranchSummary[]> {
    return this.delay(ALL.map(({ id, name, specialty, label }) => ({ id, name, specialty, label })));
  }

  getBranch(id: string): Promise<Branch> {
    const branch = BY_ID.get(id);
    if (!branch) return Promise.reject(new Error(`Unknown branch: ${id}`));
    return this.delay(branch);
  }
}

export const branchRepository: BranchRepository = new MockBranchRepository();
