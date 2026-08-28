import { useState } from 'react';
import { Card, CardKicker } from './Card';
import type { ActionState, Branch } from '../data';
import { MUTED, POS, WARN } from '../data';
import styles from './RightRail.module.css';

interface Message {
  who: 'assistant' | 'user';
  text: string;
}

const STATE_LABEL: Record<ActionState, string> = {
  pending: 'Pending',
  approved: 'Approved',
  skipped: 'Skipped',
};

const STATE_COLOR: Record<ActionState, string> = {
  pending: WARN,
  approved: POS,
  skipped: MUTED,
};

interface RightRailProps {
  branch: Branch;
  stacked: boolean;
}

export function RightRail({ branch, stacked }: RightRailProps) {
  const [actionStates, setActionStates] = useState<Record<string, ActionState>>({});
  const [messages, setMessages] = useState<Message[]>([{ who: 'assistant', text: branch.askGreeting }]);
  const [draft, setDraft] = useState('');

  const setAction = (id: string, state: ActionState) =>
    setActionStates((prev) => ({ ...prev, [id]: state }));

  const ask = (question: string) => {
    const match = branch.askPairs.find((p) => p.question === question);
    setMessages((prev) => [
      ...prev,
      { who: 'user', text: question },
      {
        who: 'assistant',
        text:
          match?.answer ??
          'Pulling that from the CRM now. In the shipped version this routes to the branch data warehouse and returns a figure with its source records attached.',
      },
    ]);
    setDraft('');
  };

  return (
    <aside className={[styles.rail, stacked ? styles.railStacked : ''].filter(Boolean).join(' ')}>
      <Card padding="16px 17px" gap={11}>
        <CardKicker>Proposed actions · needs your approval</CardKicker>
        {branch.actions.map((a) => {
          const state = actionStates[a.id] ?? 'pending';
          return (
            <div key={a.id} className={styles.action}>
              <div className={styles.actionHead}>
                <span className={styles.actionTitle}>{a.title}</span>
                <span className={styles.actionState} style={{ color: STATE_COLOR[state] }}>
                  {STATE_LABEL[state]}
                </span>
              </div>
              <p className={styles.actionBody}>{a.body}</p>
              {state === 'pending' && (
                <div className={styles.buttons}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnPrimary}`}
                    onClick={() => setAction(a.id, 'approved')}
                  >
                    Approve
                  </button>
                  <button type="button" className={styles.btn} onClick={() => setAction(a.id, 'skipped')}>
                    Skip
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </Card>

      <Card padding="16px 17px" gap={10}>
        <CardKicker>Ask about this branch</CardKicker>
        <div className={styles.thread} role="log" aria-label="Branch questions">
          {messages.map((m, i) => (
            <div
              key={i}
              className={[styles.bubble, m.who === 'user' ? styles.bubbleUser : ''].filter(Boolean).join(' ')}
            >
              {m.text}
            </div>
          ))}
        </div>
        <div className={styles.suggestions}>
          {branch.askPairs.map((p) => (
            <button key={p.question} type="button" className={styles.suggestion} onClick={() => ask(p.question)}>
              {p.question}
            </button>
          ))}
        </div>
        <form
          className={styles.composer}
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) ask(draft.trim());
          }}
        >
          <label className="srOnly" htmlFor="ask-input">
            Ask a follow-up
          </label>
          <input
            id="ask-input"
            className={styles.input}
            placeholder="Ask a follow-up…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
          />
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary} ${styles.send}`}>
            Send
          </button>
        </form>
      </Card>
    </aside>
  );
}
