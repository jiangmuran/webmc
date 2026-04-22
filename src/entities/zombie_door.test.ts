import { describe, it, expect } from 'vitest';
import { makeZombieDoorState, tickZombieDoor } from './zombie_door';

describe('zombie door break', () => {
  it('breaks after 60s on hard', () => {
    const s = makeZombieDoorState();
    let broke = false;
    for (let i = 0; i < 700; i++) {
      if (
        tickZombieDoor(s, {
          dtSec: 0.1,
          difficulty: 'hard',
          adjacentDoor: true,
          doorKind: 'webmc:oak_door',
        }).breaksDoor
      ) {
        broke = true;
        break;
      }
    }
    expect(broke).toBe(true);
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
