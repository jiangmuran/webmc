import { describe, it, expect } from 'vitest';
import { deadBlockName, makeCoral, tickCoral } from './coral';

describe('coral', () => {
  it('stays alive underwater', () => {
    const c = makeCoral('tube');
    tickCoral(c, { hasWaterAdjacent: true });
    expect(c.dead).toBe(false);
  });

  it('dies when dry', () => {
    const c = makeCoral('fire');
    tickCoral(c, { hasWaterAdjacent: false });
    expect(c.dead).toBe(true);
  });

  it("dead coral doesn't revive", () => {
    const c = makeCoral('bubble');
    tickCoral(c, { hasWaterAdjacent: false });
    tickCoral(c, { hasWaterAdjacent: true });
    expect(c.dead).toBe(true);
  });

  it('deadBlockName matches live/dead state', () => {
    const c = makeCoral('horn');
    expect(deadBlockName(c)).toBe('webmc:horn_coral');
    c.dead = true;
    expect(deadBlockName(c)).toBe('webmc:dead_horn_coral');
  });
});
