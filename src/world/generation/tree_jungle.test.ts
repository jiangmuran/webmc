import { describe, it, expect } from 'vitest';
import { rollJungle, trunkBlockCount, cocoaChance } from './tree_jungle';

describe('jungle tree', () => {
  it('thick has 2x2 trunk', () => {
    const j = rollJungle(() => 0);
    expect(j.thick).toBe(true);
    expect(trunkBlockCount(j)).toBe(j.height * 4);
  });

  it('thin has single trunk', () => {
    const j = rollJungle(() => 0.5);
    expect(trunkBlockCount(j)).toBe(j.height);
  });

  it('vines always', () => {
    expect(rollJungle(() => 0.5).vines).toBe(true);
  });

  it('cocoa sometimes spawns', () => {
    expect(cocoaChance()).toBeGreaterThan(0);
  });
});
