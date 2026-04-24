import { describe, it, expect } from 'vitest';
import { StatTracker } from './statistics_tracker';

describe('statistics tracker', () => {
  it('increments count', () => {
    const t = new StatTracker();
    t.increment('mined', 'stone', 5);
    expect(t.get('mined', 'stone')).toBe(5);
  });

  it('accumulates', () => {
    const t = new StatTracker();
    t.increment('crafted', 'torch');
    t.increment('crafted', 'torch', 2);
    expect(t.get('crafted', 'torch')).toBe(3);
  });

  it('topN by value', () => {
    const t = new StatTracker();
    t.increment('mined', 'stone', 100);
    t.increment('mined', 'dirt', 50);
    t.increment('mined', 'cobblestone', 75);
    const top = t.topN('mined', 2);
    expect(top[0]?.id).toBe('stone');
    expect(top[1]?.id).toBe('cobblestone');
  });

  it('other categories unaffected', () => {
    const t = new StatTracker();
    t.increment('killed', 'zombie', 5);
    t.increment('mined', 'stone', 10);
    expect(t.get('killed', 'stone')).toBe(0);
  });

  it('serialize yields object', () => {
    const t = new StatTracker();
    t.increment('mined', 'stone', 1);
    expect(t.serialize()['mined:stone']).toBe(1);
  });
});
