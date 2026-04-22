import { describe, it, expect } from 'vitest';
import {
  DOLPHIN_MAX_HEALTH,
  feedDolphin,
  makeDolphin,
  playersInGraceRange,
  tickDolphin,
} from './dolphin';

describe('dolphin', () => {
  it('starts idle with full HP', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    expect(d.stance).toBe('idle');
    expect(d.health).toBe(DOLPHIN_MAX_HEALTH);
  });

  it('suffocates on land', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    tickDolphin(d, { inWater: false, playerNearby: false, nearestStructure: null, dtSec: 1 });
    expect(d.stance).toBe('suffocating');
  });

  it('dies after 120s out of water', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    tickDolphin(d, { inWater: false, playerNearby: false, nearestStructure: null, dtSec: 120 });
    expect(d.stance).toBe('dead');
  });

  it('follows when player nearby', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    tickDolphin(d, { inWater: true, playerNearby: true, nearestStructure: null, dtSec: 0.1 });
    expect(d.stance).toBe('follow');
  });

  it('escorts to nearest structure once fed', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    feedDolphin(d, 'p1');
    tickDolphin(d, {
      inWater: true,
      playerNearby: true,
      nearestStructure: { x: 100, y: 62, z: 100 },
      dtSec: 0.1,
    });
    expect(d.stance).toBe('escort');
  });

  it('escort expires after lifetime', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    feedDolphin(d, 'p1');
    tickDolphin(d, {
      inWater: true,
      playerNearby: true,
      nearestStructure: { x: 10, y: 0, z: 0 },
      dtSec: 400,
    });
    expect(d.fedBy).toBeNull();
  });

  it('grants Grace to nearby players', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    const ids = playersInGraceRange(d, [
      { id: 'p1', position: { x: 3, y: 0, z: 0 } },
      { id: 'p2', position: { x: 50, y: 0, z: 0 } },
    ]);
    expect(ids).toEqual(['p1']);
  });

  it('dead dolphin grants no Grace', () => {
    const d = makeDolphin(1, { x: 0, y: 0, z: 0 });
    d.stance = 'dead';
    expect(playersInGraceRange(d, [{ id: 'p1', position: { x: 0, y: 0, z: 0 } }])).toEqual([]);
  });
});
