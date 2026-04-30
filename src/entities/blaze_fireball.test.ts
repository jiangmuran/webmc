import { describe, it, expect } from 'vitest';
import {
  BLAZE_FIREBALL_DAMAGE,
  BLAZE_FIREBALL_IGNITE_SEC,
  makeBlazeAttackState,
  makeFireball,
  tickBlazeAttack,
  tickFireball,
} from './blaze_fireball';

describe('blaze fireball', () => {
  it('travels along direction', () => {
    const p = makeFireball(1, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    tickFireball(p, { isSolid: () => false, dtSec: 0.1 });
    expect(p.position.x).toBeGreaterThan(0);
  });

  it('expires on block hit', () => {
    const p = makeFireball(1, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    const r = tickFireball(p, { isSolid: () => true, dtSec: 0.1 });
    expect(r.expired).toBe(true);
    expect(r.hitBlock).toBe(true);
  });

  it('expires after lifetime', () => {
    const p = makeFireball(1, { x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
    p.ageSec = 1.1;
    const r = tickFireball(p, { isSolid: () => false, dtSec: 0.1 });
    expect(r.expired).toBe(true);
  });

  it('damage + ignition constants', () => {
    expect(BLAZE_FIREBALL_DAMAGE).toBe(5);
    expect(BLAZE_FIREBALL_IGNITE_SEC).toBe(5);
  });
});

describe('blaze attack pattern', () => {
  it('fires 3 shots per burst (wiki: 0.3s apart over 0.9s)', () => {
    const s = makeBlazeAttackState();
    let fires = 0;
    for (let i = 0; i < 20; i++) {
      const r = tickBlazeAttack(s, { hasTarget: true, dtSec: 0.4 });
      if (r.fire) fires++;
    }
    expect(fires).toBeGreaterThanOrEqual(3);
  });

  it('post-burst cooldown is at least 4s (wiki: 5s)', () => {
    const s = makeBlazeAttackState();
    // Fire 3 shots; collect when each fires.
    let lastFireT = 0;
    let t = 0;
    let firedShots = 0;
    for (let i = 0; i < 60; i++) {
      const dt = 0.05;
      const r = tickBlazeAttack(s, { hasTarget: true, dtSec: dt });
      t += dt;
      if (r.fire) {
        lastFireT = t;
        firedShots++;
        if (firedShots === 3) break;
      }
    }
    expect(firedShots).toBe(3);
    // Now check no fires for ≥4s after the 3rd shot.
    let firedDuringCooldown = false;
    const cooldownStartT = t;
    while (t - cooldownStartT < 4) {
      const dt = 0.05;
      const r = tickBlazeAttack(s, { hasTarget: true, dtSec: dt });
      t += dt;
      if (r.fire) firedDuringCooldown = true;
    }
    expect(firedDuringCooldown).toBe(false);
    expect(lastFireT).toBeGreaterThan(0);
  });

  it('no target = no fire', () => {
    const s = makeBlazeAttackState();
    const r = tickBlazeAttack(s, { hasTarget: false, dtSec: 1 });
    expect(r.fire).toBe(false);
  });
});
