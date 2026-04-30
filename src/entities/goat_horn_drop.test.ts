import { describe, it, expect } from 'vitest';
import { canRamDropHorn, ramDropHorn, ramIntervalTicks, MAX_HORNS } from './goat_horn_drop';

describe('goat horn', () => {
  it('rammable ids', () => {
    expect(canRamDropHorn('webmc:stone')).toBe(true);
    expect(canRamDropHorn('webmc:wool')).toBe(false);
  });

  it('drops up to max from normal pool (wiki: ponder/sing/seek/feel)', () => {
    const g = { hornsRemaining: MAX_HORNS, screaming: false };
    expect(ramDropHorn(g, () => 0)).toBe('ponder');
    expect(ramDropHorn(g, () => 0.99)).toBe('feel');
    expect(ramDropHorn(g, () => 0)).toBeNull();
  });

  it('screaming goat drops from screaming pool (wiki: admire/call/yearn/dream)', () => {
    const g = { hornsRemaining: MAX_HORNS, screaming: true };
    expect(ramDropHorn(g, () => 0)).toBe('admire');
    expect(ramDropHorn(g, () => 0.99)).toBe('dream');
  });

  it('normal goat NEVER drops screaming-only horns', () => {
    const screamingOnly = new Set(['admire', 'call', 'yearn', 'dream']);
    for (let i = 0; i < 200; i++) {
      const g = { hornsRemaining: 1, screaming: false };
      const drop = ramDropHorn(g, Math.random);
      expect(drop).not.toBeNull();
      expect(screamingOnly.has(drop!)).toBe(false);
    }
  });

  it('screaming rams faster', () => {
    expect(ramIntervalTicks({ hornsRemaining: 2, screaming: true })).toBeLessThan(
      ramIntervalTicks({ hornsRemaining: 2, screaming: false }),
    );
  });
});
