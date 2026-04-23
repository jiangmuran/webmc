import { describe, it, expect } from 'vitest';
import { brokenPotDrops } from './pot_sherd_recover';

describe('pot sherd recover', () => {
  it('empty pot drops 4 bricks', () => {
    expect(brokenPotDrops([])).toEqual(['brick', 'brick', 'brick', 'brick']);
  });

  it('sherds replace bricks', () => {
    const d = brokenPotDrops([
      { face: 'north', sherd: 'angler_sherd' },
      { face: 'south', sherd: 'archer_sherd' },
    ]);
    expect(d).toContain('angler_sherd');
    expect(d).toContain('archer_sherd');
    expect(d.filter((x) => x === 'brick').length).toBe(2);
  });

  it('four sherds no bricks', () => {
    const d = brokenPotDrops([
      { face: 'north', sherd: 'a' },
      { face: 'south', sherd: 'b' },
      { face: 'east', sherd: 'c' },
      { face: 'west', sherd: 'd' },
    ]);
    expect(d).not.toContain('brick');
  });
});
