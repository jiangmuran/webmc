import { describe, it, expect } from 'vitest';
import {
  consumeForMaceCraft,
  HEAVY_CORE_MAX_STACK,
  makeHeavyCore,
  tryDropHeavyCore,
} from './heavy_core';

describe('heavy core', () => {
  it('stacks to 1', () => {
    expect(HEAVY_CORE_MAX_STACK).toBe(1);
    expect(makeHeavyCore().count).toBe(1);
  });

  it('ominous vault drops on low roll', () => {
    expect(tryDropHeavyCore({ source: 'ominous_vault', roll: 0.01 })).not.toBeNull();
  });

  it('ominous vault skips on high roll', () => {
    expect(tryDropHeavyCore({ source: 'ominous_vault', roll: 0.9 })).toBeNull();
  });

  it('command always drops', () => {
    expect(tryDropHeavyCore({ source: 'command', roll: 0.99 })).not.toBeNull();
  });

  it('mace craft needs both', () => {
    expect(consumeForMaceCraft({ heavyCore: 1, breezeRod: 1 })).toBe(true);
    expect(consumeForMaceCraft({ heavyCore: 0, breezeRod: 1 })).toBe(false);
    expect(consumeForMaceCraft({ heavyCore: 1, breezeRod: 0 })).toBe(false);
  });
});
