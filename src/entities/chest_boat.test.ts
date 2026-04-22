import { describe, it, expect } from 'vitest';
import { destroyChestBoat, makeChestBoat, tickChestBoat } from './chest_boat';
import { deposit } from '@/items/container';
import type { BoatLookup } from './boat';

class Water implements BoatLookup {
  isWater(): boolean {
    return true;
  }
  isSolid(): boolean {
    return false;
  }
}

describe('chest boat', () => {
  it('has a 27-slot container', () => {
    const cb = makeChestBoat({
      id: 1,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      yaw: 0,
      hasRider: false,
    });
    expect(cb.inventory.size).toBe(27);
  });

  it('destroy drops current contents', () => {
    const cb = makeChestBoat({
      id: 1,
      position: { x: 0, y: 0, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      yaw: 0,
      hasRider: false,
    });
    deposit(cb.inventory, { itemId: 5, count: 3, damage: 0 });
    const drops = destroyChestBoat(cb);
    expect(drops.length).toBe(1);
    expect(drops[0]?.count).toBe(3);
  });

  it('tick delegates to base boat physics', () => {
    const cb = makeChestBoat({
      id: 1,
      position: { x: 0, y: 60, z: 0 },
      velocity: { x: 0, y: 0, z: 0 },
      yaw: 0,
      hasRider: true,
    });
    tickChestBoat(cb, 0.1, { forward: 1, turn: 0 }, new Water());
    expect(Math.hypot(cb.boat.velocity.x, cb.boat.velocity.z)).toBeGreaterThan(0);
  });
});
