import type { CSSProperties, ReactNode } from 'react';
import styles from './Card.module.css';

interface CardProps {
  children: ReactNode;
  /** Padding shorthand, matching the prototype's per-card values. */
  padding?: string;
  gap?: number;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'aside';
}

export function Card({ children, padding = '15px 16px', gap = 10, className, style, as: Tag = 'section' }: CardProps) {
  return (
    <Tag className={[styles.card, className].filter(Boolean).join(' ')} style={{ padding, gap, ...style }}>
      {children}
    </Tag>
  );
}

export function CardKicker({ children }: { children: ReactNode }) {
  return <span className={styles.kicker}>{children}</span>;
}
