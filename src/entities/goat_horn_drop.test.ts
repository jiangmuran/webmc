import { describe, it, expect } from 'vitest';
import { canRamDropHorn, ramDropHorn, ramIntervalTicks, MAX_HORNS } from './goat_horn_drop';

describe('goat horn', () => {
  it('rammable ids', () => {
    expect(canRamDropHorn('webmc:stone')).toBe(true);
    expect(canRamDropHorn('webmc:wool')).toBe(false);
  });

  it('drops up to max', () => {
    const g = { hornsRemaining: MAX_HORNS, screaming: false };
    expect(ramDropHorn(g, () => 0)).toBe('ponder');
    expect(ramDropHorn(g, () => 0.99)).toBe('dream');
    expect(ramDropHorn(g, () => 0)).toBeNull();
  });

  it('screaming rams faster', () => {
    expect(ramIntervalTicks({ hornsRemaining: 2, screaming: true })).toBeLessThan(
      ramIntervalTicks({ hornsRemaining: 2, screaming: false }),
    );
  });
});
