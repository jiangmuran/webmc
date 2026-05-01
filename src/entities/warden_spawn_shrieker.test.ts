import { describe, it, expect } from 'vitest';
import {
  emergenceFraction,
  EMERGENCE_DURATION_SEC,
  findWardenSpawn,
  makeEmergence,
  tickEmergence,
  type WardenSpawnLookup,
} from './warden_spawn_shrieker';

const VALID: WardenSpawnLookup = {
  isAirAbove: () => true,
  isValidGround: () => true,
  isDark: () => true,
  skyLight: () => 0,
};

describe('warden spawn', () => {
  it('finds valid spot in dark cave', () => {
    const r = findWardenSpawn({
      playerPos: { x: 0, y: 20, z: 0 },
      lookup: VALID,
      rng: () => 0.5,
    });
    expect(r.pos).not.toBeNull();
    expect(r.rejectReason).toBe('ok');
  });

  it('rejects when ground never valid', () => {
    const r = findWardenSpawn({
      playerPos: { x: 0, y: 20, z: 0 },
      lookup: { ...VALID, isValidGround: () => false },
      rng: () => 0.5,
    });
    expect(r.pos).toBeNull();
  });

  it('rejects when too bright', () => {
    const r = findWardenSpawn({
      playerPos: { x: 0, y: 20, z: 0 },
      lookup: { ...VALID, isDark: () => false },
      rng: () => 0.5,
    });
    expect(r.pos).toBeNull();
  });
});

describe('warden emergence', () => {
  it('progresses across emergence duration (wiki: 11.25 s)', () => {
    const s = makeEmergence({ x: 0, y: 20, z: 0 });
    tickEmergence(s, EMERGENCE_DURATION_SEC / 2);
    expect(emergenceFraction(s)).toBeCloseTo(0.5);
  });

  it('completes after duration', () => {
    const s = makeEmergence({ x: 0, y: 20, z: 0 });
    expect(tickEmergence(s, EMERGENCE_DURATION_SEC)).toBe(true);
  });

  it('fraction clamped 0..1', () => {
    const s = makeEmergence({ x: 0, y: 20, z: 0 });
    tickEmergence(s, 100);
    expect(emergenceFraction(s)).toBe(1);
  });
});
