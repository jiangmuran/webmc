import { describe, it, expect } from 'vitest';
import {
  makeAllay,
  startDancing,
  stopDancing,
  giveShard,
  tickAllay,
  DUP_HOLD_MS,
  DUP_COOLDOWN_MS,
} from './allay_duplicate';

describe('allay dup', () => {
  it('needs dancing to accept shard', () => {
    const s = makeAllay();
    expect(giveShard(s, 0)).toBe(false);
    startDancing(s);
    expect(giveShard(s, 0)).toBe(true);
  });

  it('duplicates after hold', () => {
    const s = makeAllay();
    startDancing(s);
    giveShard(s, 0);
    expect(tickAllay(s, DUP_HOLD_MS - 1).duplicated).toBe(false);
    expect(tickAllay(s, DUP_HOLD_MS + 1).duplicated).toBe(true);
  });

  it('cooldown blocks repeat', () => {
    const s = makeAllay();
    startDancing(s);
    giveShard(s, 0);
    tickAllay(s, DUP_HOLD_MS + 1);
    giveShard(s, 10_000);
    expect(tickAllay(s, DUP_HOLD_MS + 20_000).duplicated).toBe(false);
    // after cooldown
    giveShard(s, DUP_COOLDOWN_MS + 1);
    expect(tickAllay(s, DUP_COOLDOWN_MS + DUP_HOLD_MS + 2).duplicated).toBe(true);
  });

  it('stop dancing clears shard', () => {
    const s = makeAllay();
    startDancing(s);
    giveShard(s, 0);
    stopDancing(s);
    expect(tickAllay(s, DUP_HOLD_MS + 1).duplicated).toBe(false);
  });
});
