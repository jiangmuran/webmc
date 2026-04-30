import { describe, it, expect } from 'vitest';
import { makeZombieDoorState, tickZombieDoor } from './zombie_door';

describe('zombie door break', () => {
  it('breaks after 12 s on hard (wiki: ~240 ticks)', () => {
    const s = makeZombieDoorState();
    let broke = false;
    let elapsed = 0;
    for (let i = 0; i < 200; i++) {
      const r = tickZombieDoor(s, {
        dtSec: 0.1,
        difficulty: 'hard',
        adjacentDoor: true,
        doorKind: 'webmc:oak_door',
      });
      elapsed += 0.1;
      if (r.breaksDoor) {
        broke = true;
        break;
      }
    }
    expect(broke).toBe(true);
    expect(elapsed).toBeGreaterThanOrEqual(12);
    expect(elapsed).toBeLessThan(13);
  });

  it('iron doors immune', () => {
    const s = makeZombieDoorState();
    const r = tickZombieDoor(s, {
      dtSec: 70,
      difficulty: 'hard',
      adjacentDoor: true,
      doorKind: 'webmc:iron_door',
    });
    expect(r.breaksDoor).toBe(false);
  });

  it('not hard → no break', () => {
    const s = makeZombieDoorState();
    const r = tickZombieDoor(s, {
      dtSec: 70,
      difficulty: 'easy',
      adjacentDoor: true,
      doorKind: 'webmc:oak_door',
    });
    expect(r.breaksDoor).toBe(false);
  });

  it('no adjacent door resets progress', () => {
    const s = makeZombieDoorState();
    tickZombieDoor(s, {
      dtSec: 30,
      difficulty: 'hard',
      adjacentDoor: true,
      doorKind: 'webmc:oak_door',
    });
    tickZombieDoor(s, {
      dtSec: 1,
      difficulty: 'hard',
      adjacentDoor: false,
      doorKind: 'webmc:oak_door',
    });
    expect(s.breakProgressSec).toBe(0);
  });
});
