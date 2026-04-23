import { describe, it, expect } from 'vitest';
import {
  isZombifying,
  tick,
  becomeZombified,
  convertsInto,
  canCureZombifiedPiglin,
  ZOMBIFICATION_TICKS,
} from './piglin_zombification';

describe('piglin zombification', () => {
  it('nether safe', () => {
    expect(isZombifying({ dimension: 'nether', ticksOutsideNether: 0 })).toBe(false);
  });

  it('overworld zombifies', () => {
    expect(isZombifying({ dimension: 'overworld', ticksOutsideNether: 0 })).toBe(true);
  });

  it('tick increments in overworld', () => {
    expect(tick({ dimension: 'overworld', ticksOutsideNether: 100 }).ticksOutsideNether).toBe(101);
  });

  it('tick resets in nether', () => {
    expect(tick({ dimension: 'nether', ticksOutsideNether: 100 }).ticksOutsideNether).toBe(0);
  });

  it('converts after threshold', () => {
    expect(
      becomeZombified({ dimension: 'overworld', ticksOutsideNether: ZOMBIFICATION_TICKS }),
    ).toBe(true);
  });

  it('converts to zombified_piglin', () => {
    expect(convertsInto()).toBe('zombified_piglin');
  });

  it('no cure', () => {
    expect(canCureZombifiedPiglin()).toBe(false);
  });
});
