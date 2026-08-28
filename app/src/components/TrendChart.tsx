import { Card, CardKicker } from './Card';
import { Pill } from './Pill';
import type { Branch, CompareMode, MetricKey } from '../data';
import { TREND_BOX, trendChart } from '../data';
import styles from './TrendChart.module.css';

const METRIC_ORDER: MetricKey[] = ['close', 'active', 'subs', 'starts'];

interface TrendChartProps {
  branch: Branch;
  metric: MetricKey;
  compare: CompareMode;
  onMetricChange: (m: MetricKey) => void;
  onCompareChange: (c: CompareMode) => void;
}

export function TrendChart({ branch, metric, compare, onMetricChange, onCompareChange }: TrendChartProps) {
  const series = branch.series[metric];
  const chart = trendChart(series, compare, 'Aug 2026');
  const compareLabel = compare === 'prior' ? 'Prior year' : 'Peer average';

  return (
    <Card padding="17px 20px 10px" gap={12}>
      <div className={styles.head}>
        <CardKicker>Trend · rolling 12 months</CardKicker>
        <div className={styles.tabs} role="radiogroup" aria-label="Metric">
          {METRIC_ORDER.map((k) => (
            <Pill key={k} label={branch.series[k].label} selected={metric === k} onClick={() => onMetricChange(k)} />
          ))}
        </div>
        <div className={styles.compare} role="radiogroup" aria-label="Comparison">
          <Pill label="vs last year" selected={compare === 'prior'} onClick={() => onCompareChange('prior')} />
          <Pill label="vs peers" selected={compare === 'peer'} onClick={() => onCompareChange('peer')} />
        </div>
      </div>

      <div className={styles.summary}>
        <div>
          <div className={styles.latest}>{chart.latest}</div>
          <div className={styles.caption}>{chart.caption}</div>
        </div>
        {chart.stats.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue} style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
        <div className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.swatchSolid} />
            This year
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatchDashed} />
            {compareLabel}
          </span>
        </div>
      </div>

      {/*
        Hand-rolled SVG, geometry straight from the handoff: 880×248 viewBox,
        plot box x 56→866, y 16→214. No charting library for four line charts.
      */}
      <svg
        viewBox={`0 0 ${TREND_BOX.width} ${TREND_BOX.height}`}
        className={styles.chart}
        role="img"
        aria-label={`${series.label}, rolling 12 months, compared with ${compareLabel.toLowerCase()}. Latest ${chart.latest}.`}
      >
        {chart.yTicks.map((t) => (
          <g key={t.label + t.y}>
            <line x1="46" x2="872" y1={t.y} y2={t.y} stroke="#16232e" strokeOpacity="0.09" />
            <text x="38" y={t.ty} textAnchor="end" fontSize="10.5" fill="var(--chart-axis-label)" fontFamily="Barlow">
              {t.label}
            </text>
          </g>
        ))}
        <path d={chart.area} fill="var(--color-accent)" fillOpacity="0.08" />
        <path d={chart.prior} fill="none" stroke="var(--chart-prior)" strokeWidth="1.6" strokeDasharray="5 4" />
        <path d={chart.line} fill="none" stroke="var(--color-accent)" strokeWidth="2.2" />
        {chart.points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="3.1" fill="#ffffff" stroke="var(--color-accent)" strokeWidth="1.8" />
            <text
              x={p.x}
              y="240"
              textAnchor="middle"
              fontSize="10.5"
              fill={p.isLatest ? 'var(--color-accent)' : 'var(--chart-axis-label)'}
              fontFamily="Barlow"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </Card>
  );
}
