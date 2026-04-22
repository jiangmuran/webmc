import { describe, it, expect } from 'vitest';
import { currentImpulseAt, itemCurrentImpulse, type CurrentLookup } from './ocean_current';

const NONE: CurrentLookup = {
  isSoulSandBelow: () => false,
  isMagmaBelow: () => false,
  waterFlowDir: () => ({ x: 0, y: 0, z: 0 }),
};

describe('ocean current', () => {
  it('no impulse outside water', () => {
    const i = currentImpulseAt({ pos: { x: 0, y: 0, z: 0 }, inWater: false, lookup: NONE });
    expect(i).toEqual({ x: 0, y: 0, z: 0 });
  });

  it('soul sand pushes up', () => {
    const l: CurrentLookup = { ...NONE, isSoulSandBelow: () => true };
    const i = currentImpulseAt({ pos: { x: 0, y: 0, z: 0 }, inWater: true, lookup: l });
    expect(i.y).toBeGreaterThan(0);
  });

  it('magma pulls down', () => {
    const l: CurrentLookup = { ...NONE, isMagmaBelow: () => true };
    const i = currentImpulseAt({ pos: { x: 0, y: 0, z: 0 }, inWater: true, lookup: l });
    expect(i.y).toBeLessThan(0);
  });

  it('water flow pushes horizontally', () => {
    const l: CurrentLookup = { ...NONE, waterFlowDir: () => ({ x: 1, y: 0, z: 0 }) };
    const i = currentImpulseAt({ pos: { x: 0, y: 0, z: 0 }, inWater: true, lookup: l });
    expect(i.x).toBeGreaterThan(0);
  });

  it('item impulse is smaller than mob impulse', () => {
    const l: CurrentLookup = { ...NONE, isSoulSandBelow: () => true };
    const mob = currentImpulseAt({ pos: { x: 0, y: 0, z: 0 }, inWater: true, lookup: l });
    const item = itemCurrentImpulse({ pos: { x: 0, y: 0, z: 0 }, inWater: true, lookup: l });
    expect(item.y).toBeLessThan(mob.y);
  });
});
