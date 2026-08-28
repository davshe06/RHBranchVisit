import { useEffect, useState } from 'react';
import { TopBar, type ViewMode } from './components/TopBar';
import { BriefCard } from './components/BriefCard';
import { KpiStrip } from './components/KpiStrip';
import { TrendChart } from './components/TrendChart';
import { DeskTable } from './components/DeskTable';
import { RightRail } from './components/RightRail';
import { DrillPanel, type Drill } from './components/DrillPanel';
import { MobileWorkspace } from './components/MobileWorkspace';
import { MOBILE_QUERY, TABLET_QUERY, useMediaQuery } from './hooks/useMediaQuery';
import { useBranch } from './hooks/useBranch';
import { DEFAULT_BRANCH_ID, type CompareMode, type MetricKey, type RoleFilter, type SortKey } from './data';
import styles from './App.module.css';

export function App() {
  const [branchId, setBranchId] = useState(DEFAULT_BRANCH_ID);
  const [previewView, setPreviewView] = useState<ViewMode>('desktop');
  const [metric, setMetric] = useState<MetricKey>('close');
  const [compare, setCompare] = useState<CompareMode>('prior');
  const [role, setRole] = useState<RoleFilter>('all');
  const [sort, setSort] = useState<SortKey>('cr');
  const [drill, setDrill] = useState<Drill | null>(null);

  const isNarrow = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);
  const { branch, branches, error } = useBranch(branchId);

  // A real narrow viewport always gets the mobile layout; on a wide screen the
  // header toggle previews it.
  const showMobile = isNarrow || previewView === 'mobile';

  // Switching branch drops any open drill — it points at the old branch's data.
  useEffect(() => setDrill(null), [branchId]);

  return (
    <div className={styles.shell}>
      <a className="skipLink" href="#workspace">
        Skip to workspace
      </a>
      <TopBar
        branches={branches}
        branchId={branchId}
        onBranchChange={setBranchId}
        view={previewView}
        onViewChange={(v) => {
          setPreviewView(v);
          setDrill(null);
        }}
        showToggle={!isNarrow}
      />

      {error && (
        <p className={`${styles.status} ${styles.error}`} role="alert">
          {error}
        </p>
      )}

      {!branch && !error && <p className={styles.status}>Loading branch…</p>}

      {branch && showMobile && (
        <MobileWorkspace
          branch={branch}
          preview={!isNarrow}
          onOpenPerson={(consultant) => setDrill({ type: 'person', consultant })}
          onOpenMetric={(m) => setDrill({ type: 'metric', metric: m })}
        />
      )}

      {branch && !showMobile && (
        <div className={styles.grid} id="workspace">
          <main className={styles.main}>
            <BriefCard branch={branch} onOpenPerson={(c) => setDrill({ type: 'person', consultant: c })} />
            <KpiStrip branch={branch} onOpenMetric={(m) => setDrill({ type: 'metric', metric: m })} />
            <TrendChart
              branch={branch}
              metric={metric}
              compare={compare}
              onMetricChange={setMetric}
              onCompareChange={setCompare}
            />
            <DeskTable
              branch={branch}
              role={role}
              sort={sort}
              onRoleChange={setRole}
              onSortChange={setSort}
              onOpenPerson={(c) => setDrill({ type: 'person', consultant: c })}
            />
          </main>
          <RightRail branch={branch} stacked={isTablet} />
        </div>
      )}

      {branch && drill && (
        <DrillPanel branch={branch} drill={drill} onNavigate={setDrill} onClose={() => setDrill(null)} />
      )}
    </div>
  );
}
