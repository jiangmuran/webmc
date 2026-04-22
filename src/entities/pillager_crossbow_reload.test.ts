import { describe, it, expect } from 'vitest';
import {
  BAD_OMEN_DURATION_SEC,
  makePillager,
  PATROL_DEFAULTS,
  tickPillagerCrossbow,
} from './pillager_crossbow_reload';

describe('pillager crossbow', () => {
  it('reloads before first shot', () => {
    const p = makePillager();
    for (let i = 0; i < 25; i++) {
      tickPillagerCrossbow(p, { hasTarget: true, inLineOfSight: true });
    }
    expect(p.loaded).toBe(true);
  });

  it('shoots when loaded + target visible', () => {
    const p = makePillager();
    p.loaded = true;
    const r = tickPillagerCrossbow(p, { hasTarget: true, inLineOfSight: true });
    expect(r.shot).toBe(true);
    expect(p.loaded).toBe(false);
  });

  it('no target = no shot', () => {
    const p = makePillager();
    p.loaded = true;
    const r = tickPillagerCrossbow(p, { hasTarget: false, inLineOfSight: true });
    expect(r.shot).toBe(false);
    expect(p.loaded).toBe(true);
  });

  it('captain reloads faster', () => {
    const n = makePillager('normal');
    const c = makePillager('captain');
    n.loaded = true;
    c.loaded = true;
    tickPillagerCrossbow(n, { hasTarget: true, inLineOfSight: true });
    tickPillagerCrossbow(c, { hasTarget: true, inLineOfSight: true });
    expect(c.reloadTicksRemaining).toBeLessThanOrEqual(n.reloadTicksRemaining);
  });

  it('bad omen duration 100min', () => {
    expect(BAD_OMEN_DURATION_SEC).toBe(6000);
  });

  it('patrol defaults reasonable', () => {
    expect(PATROL_DEFAULTS.minGroupSize).toBeLessThan(PATROL_DEFAULTS.maxGroupSize);
  });
});
