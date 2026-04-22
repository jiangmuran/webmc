import { describe, it, expect } from 'vitest';
import {
  makeDifficulty,
  setDifficulty,
  lock,
  enableHardcore,
  hardcoreOnDeath,
} from './world_difficulty_lock';

describe('difficulty lock', () => {
  it('change allowed by default', () => {
    const w = makeDifficulty();
    expect(setDifficulty(w, 'easy')).toBe(true);
  });

  it('locked blocks changes', () => {
    const w = makeDifficulty();
    lock(w);
    expect(setDifficulty(w, 'easy')).toBe(false);
  });

  it('hardcore locks on hard', () => {
    const w = makeDifficulty();
    enableHardcore(w);
    expect(w.current).toBe('hard');
    expect(setDifficulty(w, 'easy')).toBe(false);
  });

  it('lock idempotent', () => {
    const w = makeDifficulty();
    lock(w);
    expect(lock(w)).toBe(false);
  });

  it('on death only hardcore', () => {
    const normal = makeDifficulty();
    expect(hardcoreOnDeath(normal)).toBeNull();
    const hc = makeDifficulty();
    enableHardcore(hc);
    expect(hardcoreOnDeath(hc)).toBe('spectator_lock');
  });
});
