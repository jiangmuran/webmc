import { describe, it, expect } from 'vitest';
import {
  ENDER_PEARL_COOLDOWN_SEC,
  ENDER_PEARL_SELF_DAMAGE,
  makeEnderPearl,
  tickEnderPearl,
} from './ender_pearl';

describe('ender pearl', () => {
  it('flies with initial velocity', () => {
    const p = makeEnderPearl({ x: 0, y: 70, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    tickEnderPearl(p, { isSolid: () => false, dtSec: 0.1 });
    expect(p.position.x).toBeGreaterThan(0);
  });

  it('impact returns teleport target', () => {
    const p = makeEnderPearl({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }, 1);
    const r = tickEnderPearl(p, { isSolid: () => true, dtSec: 0.1 });
    expect(r.impacted).toBe(true);
    expect(r.teleportTo).not.toBeNull();
  });

  it('expires after 30s', () => {
    const p = makeEnderPearl({ x: 0, y: 70, z: 0 }, { x: 0, y: 0, z: 0 }, 1);
    const r = tickEnderPearl(p, { isSolid: () => false, dtSec: 31 });
    expect(r.expired).toBe(true);
  });

  it('constants set', () => {
    expect(ENDER_PEARL_SELF_DAMAGE).toBe(5);
    expect(ENDER_PEARL_COOLDOWN_SEC).toBe(1);
  });
});
