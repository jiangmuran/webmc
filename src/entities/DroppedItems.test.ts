import { describe, it, expect } from 'vitest';
import { DroppedItemWorld, type PickupOutcome } from './DroppedItems';

const noSolid = (): boolean => false;
// Floor at y=0 — item lands and stops moving so the test isn't sensitive
// to the random pop-up velocity.
const floor = (_x: number, y: number): boolean => y < 0;

describe('DroppedItemWorld', () => {
  it('preserves damage on pickup', () => {
    const w = new DroppedItemWorld();
    w.spawn(0, 1, 0, { itemId: 7, count: 1, color: [200, 200, 200], damage: 123 });
    let captured: PickupOutcome | null = null;
    // Sit at the spawn so the magnetic pull always sees us within range.
    for (let i = 0; i < 200; i++) {
      w.tick(0.05, floor, { x: 0, y: 0.5, z: 0 }, (out) => {
        captured = out;
        return 0;
      });
      if (captured) break;
    }
    expect(captured).not.toBeNull();
    expect(captured!.damage).toBe(123);
  });

  it('skips merging when damage values differ', () => {
    const w = new DroppedItemWorld();
    w.spawn(0, 0, 0, { itemId: 7, count: 1, color: [0, 0, 0], damage: 10 });
    w.spawn(0, 0, 0, { itemId: 7, count: 1, color: [0, 0, 0], damage: 50 });
    // Run one tick — mergeNearby is called inside tick.
    w.tick(0.01, noSolid, { x: 999, y: 999, z: 999 }, () => 0);
    expect(w.size).toBe(2);
  });

  it('still merges identical damage stacks', () => {
    const w = new DroppedItemWorld();
    w.spawn(0, 0, 0, { itemId: 7, count: 1, color: [0, 0, 0], damage: 10 });
    w.spawn(0, 0, 0, { itemId: 7, count: 2, color: [0, 0, 0], damage: 10 });
    w.tick(0.01, noSolid, { x: 999, y: 999, z: 999 }, () => 0);
    expect(w.size).toBe(1);
  });
});
