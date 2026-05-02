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

  it('damage scales by difficulty per wiki', () => {
    // minecraft.wiki/w/Iron_Golem damage table:
    //   Easy   4.75–11.75  → midpoint 8.25
    //   Normal 7.5 –21.5   → midpoint 14.5
    //   Hard   11.25–32.25 → midpoint 21.75
    const ge = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    const re = tryAttack(ge, {
      target: { id: 2, position: { x: 1, y: 0, z: 0 } },
      rng: () => 0.5,
      difficulty: 'easy',
    });
    expect(re.damage).toBeCloseTo(8.25, 2);

    const gn = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    const rn = tryAttack(gn, {
      target: { id: 2, position: { x: 1, y: 0, z: 0 } },
      rng: () => 0.5,
      difficulty: 'normal',
    });
    expect(rn.damage).toBeCloseTo(14.5, 2);

    const gh = makeIronGolem(1, { x: 0, y: 0, z: 0 });
    const rh = tryAttack(gh, {
      target: { id: 2, position: { x: 1, y: 0, z: 0 } },
      rng: () => 0.5,
      difficulty: 'hard',
    });
    expect(rh.damage).toBeCloseTo(21.75, 2);
  });
});
