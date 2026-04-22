import { describe, it, expect } from 'vitest';
import {
  BELL_RAIDER_RADIUS,
  computeRingEffect,
  makeBell,
  onBellChime,
  ringBell,
  tickBell,
} from './bell_ring';

describe('bell', () => {
  it('ring sets ringing state', () => {
    const b = makeBell();
    ringBell(b);
    expect(b.ringing).toBe(true);
  });

  it('tick advances swing and clears after duration', () => {
    const b = makeBell();
    ringBell(b);
    tickBell(b, 2);
    expect(b.ringing).toBe(false);
  });

  it('raiders glow within radius', () => {
    const r = computeRingEffect({
      bellPos: { x: 0, y: 0, z: 0 },
      raiders: [
        { id: 1, position: { x: 10, y: 0, z: 0 }, isRaider: true },
        { id: 2, position: { x: 100, y: 0, z: 0 }, isRaider: true },
      ],
    });
    expect(r.glowingRaiderIds).toEqual([1]);
  });

  it('non-raiders ignored', () => {
    const r = computeRingEffect({
      bellPos: { x: 0, y: 0, z: 0 },
      raiders: [{ id: 1, position: { x: 5, y: 0, z: 0 }, isRaider: false }],
    });
    expect(r.glowingRaiderIds).toEqual([]);
  });

  it('sound range includes all nearby entities', () => {
    const r = computeRingEffect({
      bellPos: { x: 0, y: 0, z: 0 },
      raiders: [
        { id: 1, position: { x: 5, y: 0, z: 0 }, isRaider: false },
        { id: 2, position: { x: 50, y: 0, z: 0 }, isRaider: true },
      ],
    });
    expect(r.soundsTo).toContain(1);
    expect(r.soundsTo).not.toContain(2);
  });

  it('radius is 32', () => {
    expect(BELL_RAIDER_RADIUS).toBe(32);
  });

  it('schedule cycles', () => {
    expect(onBellChime('work')).toBe('gather');
    expect(onBellChime('gather')).toBe('home');
    expect(onBellChime('home')).toBe('work');
  });
});
