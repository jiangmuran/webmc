import { describe, it, expect } from 'vitest';
import { rollSuspicious } from './suspicious_block_loot';

describe('suspicious block loot', () => {
  it('desert pyramid has pottery sherds', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) seen.add(rollSuspicious('desert_pyramid', Math.random));
    expect([...seen].some((s) => s.includes('sherd'))).toBe(true);
  });

  it('trail ruins rare pool', () => {
    const seen = new Set<string>();
    for (let i = 0; i < 300; i++) seen.add(rollSuspicious('trail_ruins_rare', Math.random));
    expect(seen.size).toBeLessThanOrEqual(2);
  });

  it('low roll first item', () => {
    expect(rollSuspicious('desert_pyramid', () => 0)).toBe('pottery_sherd_archer');
  });
});
