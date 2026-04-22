import { describe, it, expect } from 'vitest';
import { KILLER_BUNNY_CONTACT_DAMAGE, makeRabbit, tickRabbit } from './rabbit_jump';

describe('rabbit jump', () => {
  it('hops when moving + cooldown clear', () => {
    const r = makeRabbit();
    const h = tickRabbit(r, { dtSec: 0.1, moving: true, rng: () => 0 }, 0);
    expect(h.hops).toBe(true);
    expect(h.velocity.y).toBeGreaterThan(0);
  });

  it('no hop when idle', () => {
    const r = makeRabbit();
    const h = tickRabbit(r, { dtSec: 0.1, moving: false, rng: () => 0 }, 0);
    expect(h.hops).toBe(false);
  });

  it('killer bunny hops faster', () => {
    const normal = makeRabbit();
    const killer = makeRabbit(true);
    tickRabbit(normal, { dtSec: 0.1, moving: true, rng: () => 0 }, 0);
    tickRabbit(killer, { dtSec: 0.1, moving: true, rng: () => 0 }, 0);
    expect(killer.hopCooldownSec).toBeLessThan(normal.hopCooldownSec);
  });

  it('killer bunny contact damage 8', () => {
    expect(KILLER_BUNNY_CONTACT_DAMAGE).toBe(8);
  });
});
