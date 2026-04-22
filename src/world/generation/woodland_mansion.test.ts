import { describe, it, expect } from 'vitest';
import { countRooms, MANSION_ROOMS, planMansion } from './woodland_mansion';

describe('woodland mansion', () => {
  it('foyer is always placed on floor 1 at center', () => {
    const rooms = planMansion({ gridSize: 7, rng: () => 0.1 });
    const foyers = rooms.filter((r) => r.kind === 'foyer');
    expect(foyers.length).toBe(1);
    expect(foyers[0]?.floor).toBe(1);
    expect(foyers[0]?.gridX).toBe(3);
    expect(foyers[0]?.gridZ).toBe(3);
  });

  it('fills 3 floors × gridSize²', () => {
    const rooms = planMansion({ gridSize: 7, rng: () => 0.5 });
    expect(rooms.length).toBe(3 * 7 * 7);
  });

  it('balcony only on floor 3', () => {
    const rooms = planMansion({ gridSize: 7, rng: () => 0.5 });
    const balconies = rooms.filter((r) => r.kind === 'balcony');
    for (const b of balconies) expect(b.floor).toBe(3);
  });

  it('secret library never on floor 1', () => {
    const rooms = planMansion({ gridSize: 7, rng: () => 0.5 });
    const sec = rooms.filter((r) => r.kind === 'secret_library');
    for (const s of sec) expect(s.floor).not.toBe(1);
  });

  it('countRooms sums correctly', () => {
    const rooms = planMansion({ gridSize: 5, rng: () => 0.1 });
    expect(countRooms(rooms, 'foyer')).toBe(1);
  });

  it('corridor is the most common by weight', () => {
    expect(MANSION_ROOMS.corridor.weight).toBeGreaterThan(MANSION_ROOMS.library.weight);
  });
});
