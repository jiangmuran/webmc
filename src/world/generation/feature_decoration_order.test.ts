import { describe, it, expect } from 'vitest';
import { stepOrder, runsBefore, GEN_ORDER } from './feature_decoration_order';

describe('feature decoration order', () => {
  it('caves run first', () => {
    expect(stepOrder('caves')).toBe(0);
  });

  it('caves before trees', () => {
    expect(runsBefore('caves', 'trees')).toBe(true);
  });

  it('ore_coal before ore_diamond', () => {
    expect(runsBefore('ore_coal', 'ore_diamond')).toBe(true);
  });

  it('snow near the end', () => {
    expect(stepOrder('snow')).toBeGreaterThan(stepOrder('trees'));
  });

  it('order has uniques', () => {
    expect(new Set(GEN_ORDER).size).toBe(GEN_ORDER.length);
  });
});
