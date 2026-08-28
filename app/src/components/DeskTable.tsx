import { Card, CardKicker } from './Card';
import { Pill } from './Pill';
import type { Branch, Consultant, RoleFilter, SortKey } from '../data';
import { TABLE_COLUMNS, avatarBg, cellsFor, initials, visibleDesks } from '../data';
import styles from './DeskTable.module.css';

const ROLE_FILTERS: { key: RoleFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'sales', label: 'Sales' },
  { key: 'recruiting', label: 'Recruiting' },
];

interface DeskTableProps {
  branch: Branch;
  role: RoleFilter;
  sort: SortKey;
  onRoleChange: (r: RoleFilter) => void;
  onSortChange: (s: SortKey) => void;
  onOpenPerson: (c: Consultant) => void;
}

export function DeskTable({ branch, role, sort, onRoleChange, onSortChange, onOpenPerson }: DeskTableProps) {
  const rows = visibleDesks(branch, role, sort);

  return (
    <Card padding="17px 20px" gap={11}>
      <div className={styles.head}>
        <CardKicker>Desk-by-desk</CardKicker>
        <span className={styles.count}>
          {rows.length} of {branch.desks.length} desks · click a row to drill in
        </span>
        <div className={styles.filters} role="radiogroup" aria-label="Role filter">
          {ROLE_FILTERS.map((r) => (
            <Pill key={r.key} label={r.label} selected={role === r.key} onClick={() => onRoleChange(r.key)} />
          ))}
        </div>
      </div>

      <div className={styles.scroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.nameCol} scope="col">
                Consultant
              </th>
              {TABLE_COLUMNS.map((c) => (
                <th key={c.key} scope="col" aria-sort={sort === c.key ? 'descending' : 'none'}>
                  <button
                    type="button"
                    className={[styles.numHead, sort === c.key ? styles.sorted : ''].filter(Boolean).join(' ')}
                    onClick={() => onSortChange(c.key)}
                  >
                    {c.label}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.id}
                className={styles.row}
                tabIndex={0}
                role="button"
                aria-label={`Open desk detail for ${p.name}`}
                onClick={() => onOpenPerson(p)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenPerson(p);
                  }
                }}
              >
                <td className={styles.nameCol}>
                  <div className={styles.person}>
                    <span className={styles.avatar} style={{ background: avatarBg(p) }} aria-hidden>
                      {initials(p.name)}
                    </span>
                    <span className={styles.names}>
                      <span className={styles.name}>{p.name}</span>
                      <span className={styles.role}>{p.role}</span>
                    </span>
                    {p.badge && <span className={styles.badge}>{p.badge}</span>}
                  </div>
                </td>
                {cellsFor(p, branch.closeRatioBenchmark, branch.expectations).map((cell, i) => (
                  <td
                    key={TABLE_COLUMNS[i].key}
                    className={styles.num}
                    style={{ color: cell.color, fontWeight: cell.weight }}
                  >
                    {cell.value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.legend}>
        <span>Activity columns are trailing 30 days.</span>
        <span className={styles.legendNeg}>■ below expected range</span>
        <span className={styles.legendPos}>■ ahead of benchmark</span>
      </div>
    </Card>
  );
}
