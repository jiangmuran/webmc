import { describe, it, expect } from 'vitest';
import {
  damageGolem,
  feedIronIngot,
  GOLEM_MAX_HEALTH,
  makeIronGolem,
  tryAttack,
} from './iron_golem_attack';

describe('iron golem', () => {
  it('starts at 100 HP', () => {
    expect(makeIronGolem(1, { x: 0, y: 0, z: 0 }).health).toBe(GOLEM_MAX_HEALTH);
  });

  it('hits close target', () => {
    const g = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    const r = tryAttack(g, {
      target: { id: 2, position: { x: 1, y: 0, z: 0 } },
      rng: () => 0.5,
    });
    expect(r.hit).toBe(true);
    expect(r.damage).toBeGreaterThan(7.5);
    expect(r.launchY).toBeGreaterThan(0);
  });

  it('misses far target', () => {
    const g = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    const r = tryAttack(g, {
      target: { id: 2, position: { x: 50, y: 0, z: 0 } },
      rng: () => 0.5,
    });
    expect(r.hit).toBe(false);
  });

  it('cooldown blocks repeat attack', () => {
    const g = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    tryAttack(g, {
      target: { id: 2, position: { x: 1, y: 0, z: 0 } },
      rng: () => 0.5,
    });
    const r2 = tryAttack(g, {
      target: { id: 2, position: { x: 1, y: 0, z: 0 } },
      rng: () => 0.5,
    });
    expect(r2.hit).toBe(false);
  });

  it('player damages fully; mob damages half', () => {
    const g = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    const took = damageGolem(g, 10, false);
    expect(took).toBe(5);
  });

  it('iron ingot heals up to max', () => {
    const g = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    damageGolem(g, 30, true);
    const healed = feedIronIngot(g);
    expect(healed).toBe(25);
  });
});
