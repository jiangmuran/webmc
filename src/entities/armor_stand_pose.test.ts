import { describe, it, expect } from 'vitest';
import {
  makeArmorStand,
  normalizeAngle,
  normalizeEuler,
  damageArmorStand,
} from './armor_stand_pose';

describe('armor stand', () => {
  it('default pose has arms slightly out', () => {
    const s = makeArmorStand();
    expect(s.pose.leftArm.x).toBe(-10);
  });

  it('angle normalize', () => {
    expect(normalizeAngle(0)).toBe(0);
    expect(normalizeAngle(360)).toBe(0);
    expect(normalizeAngle(370)).toBe(10);
    expect(normalizeAngle(-10)).toBe(-10);
    expect(normalizeAngle(180)).toBe(-180);
  });

  it('normalize euler', () => {
    const e = normalizeEuler({ x: 370, y: -200, z: 540 });
    expect(e.x).toBe(10);
    expect(e.y).toBe(160);
    expect(e.z).toBe(-180);
  });

  it('marker ignores damage', () => {
    const s = makeArmorStand();
    s.marker = true;
    expect(damageArmorStand(s, { amount: 100, source: 'melee' })).toBe(0);
  });

  it('void always kills', () => {
    const s = makeArmorStand();
    expect(damageArmorStand(s, { amount: 1, source: 'void' })).toBe(Infinity);
  });
});
