import { describe, it, expect } from 'vitest';
import {
  makeFlee,
  onHit,
  isFleeing,
  speedMultiplier,
  FLEE_DURATION_MS,
  FLEE_SPEED_MULT,
} from './mob_fleeing_logic';

describe('mob fleeing', () => {
  it('passive flees on hit', () => {
    const s = makeFlee();
    onHit(s, { kind: 'passive', attackerId: 'Steve', nowMs: 0 });
    expect(isFleeing(s, 500)).toBe(true);
  });

  it('hostile does not flee', () => {
    const s = makeFlee();
    onHit(s, { kind: 'hostile', attackerId: 'Steve', nowMs: 0 });
    expect(isFleeing(s, 500)).toBe(false);
  });

  it('fleeing speed boost', () => {
    const s = makeFlee();
    onHit(s, { kind: 'passive', attackerId: 'Steve', nowMs: 0 });
    expect(speedMultiplier(s, 100)).toBe(FLEE_SPEED_MULT);
    expect(speedMultiplier(s, FLEE_DURATION_MS + 1)).toBe(1);
  });

  it('expires', () => {
    const s = makeFlee();
    onHit(s, { kind: 'passive', attackerId: 'Steve', nowMs: 0 });
    expect(isFleeing(s, FLEE_DURATION_MS + 1)).toBe(false);
  });
});
