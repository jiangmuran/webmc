import { describe, it, expect } from 'vitest';
import { makeGoatRam, maybeDropHorn, tickGoatRam } from './goat_ram';

describe('goat ram', () => {
  it('normal goat rams with damage 1-3', () => {
    const g = makeGoatRam(false);
    const r = tickGoatRam(g, { dtSec: 1, hasRamTarget: true, rng: () => 0.5 });
    expect(r.ram).toBe(true);
    expect(r.damage).toBeGreaterThanOrEqual(1);
    expect(r.damage).toBeLessThanOrEqual(3);
  });

  it('screaming goat has shorter cooldown', () => {
    const normal = makeGoatRam(false);
    const screaming = makeGoatRam(true);
    tickGoatRam(normal, { dtSec: 1, hasRamTarget: true, rng: () => 0.5 });
    tickGoatRam(screaming, { dtSec: 1, hasRamTarget: true, rng: () => 0.5 });
    expect(screaming.ramCooldownSec).toBeLessThan(normal.ramCooldownSec);
  });

  it('no target → no ram', () => {
    const g = makeGoatRam(false);
    expect(tickGoatRam(g, { dtSec: 1, hasRamTarget: false, rng: () => 0 }).ram).toBe(false);
  });

  it('only screaming goats drop horn', () => {
    expect(maybeDropHorn({ blockHardness: 2, isScreaming: false, rng: () => 0 })).toBeNull();
    expect(maybeDropHorn({ blockHardness: 2, isScreaming: true, rng: () => 0 })).toBe(
      'webmc:goat_horn',
    );
  });

  it("soft block doesn't produce horn", () => {
    expect(maybeDropHorn({ blockHardness: 0.3, isScreaming: true, rng: () => 0 })).toBeNull();
  });
});
