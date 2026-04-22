import { describe, it, expect } from 'vitest';
import { StatTracker } from './player_stats_tracker';

describe('stat tracker', () => {
  it('add accumulates', () => {
    const t = new StatTracker();
    t.add('blocks_mined');
    t.add('blocks_mined', 4);
    expect(t.get('blocks_mined')).toBe(5);
  });

  it('missing = 0', () => {
    const t = new StatTracker();
    expect(t.get('deaths')).toBe(0);
  });

  it('snapshot round-trip', () => {
    const t = new StatTracker();
    t.add('deaths', 3);
    const snap = t.snapshot();
    const t2 = new StatTracker();
    t2.load(snap);
    expect(t2.get('deaths')).toBe(3);
  });

  it('reset clears', () => {
    const t = new StatTracker();
    t.add('jumps', 10);
    t.reset();
    expect(t.get('jumps')).toBe(0);
  });
});
