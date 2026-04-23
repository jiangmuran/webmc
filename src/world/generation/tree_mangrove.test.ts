import { describe, it, expect } from 'vitest';
import { rollMangrove, growsOnMud, rootsCanWaterlog } from './tree_mangrove';

describe('mangrove tree', () => {
  it('has height + roots', () => {
    const m = rollMangrove(() => 0.5);
    expect(m.height).toBeGreaterThan(0);
    expect(m.rootsSpan).toBeGreaterThan(0);
  });

  it('propagule sometimes', () => {
    expect(rollMangrove(() => 0).propaguleDrop).toBe(true);
  });

  it('grows on mud', () => {
    expect(growsOnMud()).toBe(true);
  });

  it('roots waterloggable', () => {
    expect(rootsCanWaterlog()).toBe(true);
  });
});
