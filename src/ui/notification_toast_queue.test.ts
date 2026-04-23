import { describe, it, expect } from 'vitest';
import { activeToasts, pushToast, DEFAULT_DURATION_MS } from './notification_toast_queue';

describe('notification toast queue', () => {
  const t = (ms: number, dur: number) => ({
    message: 'hi',
    category: 'info' as const,
    enqueuedAtMs: ms,
    durationMs: dur,
  });

  it('still-active within duration', () => {
    expect(activeToasts([t(0, DEFAULT_DURATION_MS)], 1000)).toHaveLength(1);
  });

  it('expired dropped', () => {
    expect(activeToasts([t(0, 1000)], 2000)).toHaveLength(0);
  });

  it('queue caps', () => {
    let q: ReturnType<typeof t>[] = [];
    for (let i = 0; i < 10; i++) q = pushToast(q, t(i, 5000), 5);
    expect(q).toHaveLength(5);
  });
});
