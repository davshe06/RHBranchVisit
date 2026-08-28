import { useEffect, useState } from 'react';
import { branchRepository, type Branch, type BranchSummary } from '../data';

interface BranchState {
  branch: Branch | null;
  branches: BranchSummary[];
  error: string | null;
}

/** Loads the branch list once, then the selected branch through the CRM seam. */
export function useBranch(branchId: string): BranchState {
  const [branches, setBranches] = useState<BranchSummary[]>([]);
  const [branch, setBranch] = useState<Branch | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let live = true;
    branchRepository
      .listBranches()
      .then((b) => live && setBranches(b))
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : 'Could not load branches'));
    return () => {
      live = false;
    };
  }, []);

  useEffect(() => {
    let live = true;
    setError(null);
    branchRepository
      .getBranch(branchId)
      .then((b) => live && setBranch(b))
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : 'Could not load branch'));
    return () => {
      live = false;
    };
  }, [branchId]);

  return { branch, branches, error };
}
