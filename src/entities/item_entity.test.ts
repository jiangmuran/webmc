import { describe, it, expect } from 'vitest';
import { ItemEntityWorld } from './item_entity';

const floorAtY40 = (_x: number, y: number): boolean => y <= 39;
const maxStack = (): number => 64;

describe('ItemEntityWorld', () => {
  it('spawns an item entity', () => {
    const w = new ItemEntityWorld();
    w.spawn({ itemId: 5, count: 3, damage: 0 }, { x: 0, y: 50, z: 0 });
    expect(w.size).toBe(1);
  });

  it('gravity pulls item to the floor', () => {
    const w = new ItemEntityWorld();
    const e = w.spawn({ itemId: 5, count: 1, damage: 0 }, { x: 0, y: 50, z: 0 });
    for (let i = 0; i < 60; i++) {
      w.tick(1 / 20, {
        isSolid: floorAtY40,
        playerPos: null,
        pickupRadius: 0,
        pickup: () => false,
        maxStack,
      });
    }
    expect(e.onGround).toBe(true);
  });

  it('merges nearby identical stacks', () => {
    const w = new ItemEntityWorld();
    w.spawn({ itemId: 5, count: 3, damage: 0 }, { x: 0, y: 40.2, z: 0 });
    w.spawn({ itemId: 5, count: 2, damage: 0 }, { x: 0.1, y: 40.2, z: 0 });
    w.tick(1 / 20, {
      isSolid: floorAtY40,
      playerPos: null,
      pickupRadius: 0,
      pickup: () => false,
      maxStack,
    });
    expect(w.size).toBe(1);
    const e = Array.from(w.all())[0];
    expect(e?.stack.count).toBe(5);
  });

  it('player within pickup radius picks up', () => {
    const w = new ItemEntityWorld();
    w.spawn({ itemId: 5, count: 3, damage: 0 }, { x: 0, y: 40.2, z: 0 });
    const picks: number[] = [];
    // Wait past the pickup delay.
    for (let i = 0; i < 20; i++) {
      w.tick(1 / 20, {
        isSolid: floorAtY40,
        playerPos: null,
        pickupRadius: 0,
        pickup: () => false,
        maxStack,
      });
    }
    w.tick(1 / 20, {
      isSolid: floorAtY40,
      playerPos: { x: 0.5, y: 40.5, z: 0 },
      pickupRadius: 2,
      pickup: (s) => {
        picks.push(s.count);
        return true;
      },
      maxStack,
    });
    expect(picks).toEqual([3]);
    expect(w.size).toBe(0);
  });

  it('respects pickup radius — out-of-range ignored', () => {
    const w = new ItemEntityWorld();
    w.spawn({ itemId: 5, count: 3, damage: 0 }, { x: 0, y: 40.2, z: 0 });
    for (let i = 0; i < 30; i++) {
      w.tick(1 / 20, {
        isSolid: floorAtY40,
        playerPos: { x: 10, y: 40, z: 10 },
        pickupRadius: 1,
        pickup: () => true,
        maxStack,
      });
    }
    expect(w.size).toBe(1);
  });
});
