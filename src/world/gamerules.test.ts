import { describe, it, expect } from 'vitest';
import { defaultRules, set, toggle } from './gamerules';

describe('gamerules', () => {
  it('defaults sensible', () => {
    const r = defaultRules();
    expect(r.doDaylightCycle).toBe(true);
    expect(r.keepInventory).toBe(false);
    expect(r.randomTickSpeed).toBe(3);
  });

  it('set numeric', () => {
    const r = set(defaultRules(), 'randomTickSpeed', 12);
    expect(r.randomTickSpeed).toBe(12);
  });

  it('set bool', () => {
    const r = set(defaultRules(), 'keepInventory', true);
    expect(r.keepInventory).toBe(true);
  });

  it('toggle bool', () => {
    const r = toggle(defaultRules(), 'mobGriefing');
    expect(r.mobGriefing).toBe(false);
  });

  it('immutable update', () => {
    const a = defaultRules();
    const b = set(a, 'keepInventory', true);
    expect(a.keepInventory).toBe(false);
    expect(b.keepInventory).toBe(true);
  });
});
