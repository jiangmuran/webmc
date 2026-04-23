import { describe, it, expect } from 'vitest';
import { pickupsInRange } from './hopper_pickup_items';

const hopper = { x: 0, y: 0, z: 0, invFull: false };

describe('hopper pickup items', () => {
  it('picks close items above', () => {
    expect(pickupsInRange([{ x: 0, y: 1, z: 0 }], hopper)).toHaveLength(1);
  });

  it('full hopper skips', () => {
    expect(pickupsInRange([{ x: 0, y: 1, z: 0 }], { ...hopper, invFull: true })).toHaveLength(0);
  });

  it('too far skipped', () => {
    expect(pickupsInRange([{ x: 5, y: 1, z: 0 }], hopper)).toHaveLength(0);
  });
});
