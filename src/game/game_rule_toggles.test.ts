import { describe, it, expect } from 'vitest';
import { setRule, DEFAULTS } from './game_rule_toggles';

describe('game rule toggles', () => {
  it('defaults sane', () => {
    expect(DEFAULTS.doDaylightCycle).toBe(true);
    expect(DEFAULTS.keepInventory).toBe(false);
  });

  it('set rule', () => {
    const r = setRule(DEFAULTS, 'keepInventory', true);
    expect(r.keepInventory).toBe(true);
  });

  it('setRule immutable', () => {
    const r = setRule(DEFAULTS, 'mobGriefing', false);
    expect(DEFAULTS.mobGriefing).toBe(true);
    expect(r.mobGriefing).toBe(false);
  });
});
