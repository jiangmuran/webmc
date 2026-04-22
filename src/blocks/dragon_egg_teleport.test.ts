import { describe, it, expect } from 'vitest';
import { teleportDragonEgg } from './dragon_egg_teleport';

describe('dragon egg teleport', () => {
  it('teleports to a replaceable spot', () => {
    const t = teleportDragonEgg({ x: 0, y: 60, z: 0 }, { isReplaceable: () => true });
    expect(t).not.toBeNull();
  });

  it('returns null when nothing is replaceable', () => {
    const t = teleportDragonEgg({ x: 0, y: 60, z: 0 }, { isReplaceable: () => false });
    expect(t).toBeNull();
  });

  it('stays within 15-block radius', () => {
    const t = teleportDragonEgg({ x: 0, y: 60, z: 0 }, { isReplaceable: () => true });
    if (!t) return;
    expect(Math.abs(t.x)).toBeLessThanOrEqual(15);
    expect(Math.abs(t.y - 60)).toBeLessThanOrEqual(15);
  });
});
