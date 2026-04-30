import { describe, it, expect } from 'vitest';
import { SONIC_BOOM_DAMAGE, entitiesInBeam, makeSonicBoom, tickSonic } from './warden_sonic';

describe('warden sonic boom', () => {
  it('needs 3 seconds of charge + line of sight', () => {
    const s = makeSonicBoom();
    let fired = false;
    for (let i = 0; i < 60; i++) {
      if (tickSonic(s, { hasTarget: true, lineOfSight: true, dtSec: 0.1 }).fired) fired = true;
    }
    expect(fired).toBe(true);
  });

  it('breaks charge when line of sight lost', () => {
    const s = makeSonicBoom();
    tickSonic(s, { hasTarget: true, lineOfSight: true, dtSec: 1.5 });
    tickSonic(s, { hasTarget: true, lineOfSight: false, dtSec: 0.1 });
    expect(s.chargingSec).toBe(0);
  });

  it('cooldown blocks immediate re-fire', () => {
    const s = makeSonicBoom();
    for (let i = 0; i < 40; i++) {
      tickSonic(s, { hasTarget: true, lineOfSight: true, dtSec: 0.1 });
    }
    const r = tickSonic(s, { hasTarget: true, lineOfSight: true, dtSec: 0.1 });
    expect(r.fired).toBe(false);
  });

  it('entitiesInBeam hits only targets in the cone', () => {
    const hits = entitiesInBeam({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, [
      { id: 1, position: { x: 5, y: 0, z: 0 } }, // on beam
      { id: 2, position: { x: 5, y: 0, z: 5 } }, // off to side
      { id: 3, position: { x: 15, y: 0, z: 0 } }, // farther on beam
      { id: 4, position: { x: -5, y: 0, z: 0 } }, // behind warden
    ]);
    expect(hits).toContain(1);
    expect(hits).toContain(3);
    expect(hits).not.toContain(2);
    expect(hits).not.toContain(4);
  });

  it('damage constant is 10 (Normal difficulty, wiki)', () => {
    // Wiki: Sonic Boom 6/10/15 on Easy/Normal/Hard. Default Normal.
    expect(SONIC_BOOM_DAMAGE).toBe(10);
  });
});
