import { describe, it, expect } from 'vitest';
import {
  forceDespawn,
  makeTraderDespawn,
  tickTraderDespawn,
  TRADER_LIFESPAN_SEC,
} from './wandering_trader_despawn';

describe('wandering trader despawn', () => {
  it('lives ~40 minutes', () => {
    expect(TRADER_LIFESPAN_SEC).toBe(2400);
  });

  it('timer decreases', () => {
    const s = makeTraderDespawn();
    tickTraderDespawn(s, 60);
    expect(s.remainingSec).toBe(TRADER_LIFESPAN_SEC - 60);
  });

  it('despawns at zero', () => {
    const s = makeTraderDespawn();
    const r = tickTraderDespawn(s, TRADER_LIFESPAN_SEC);
    expect(r.despawnNow).toBe(true);
    expect(r.llamasToFree).toBe(true);
    expect(s.despawned).toBe(true);
  });

  it('second tick after despawn is idempotent', () => {
    const s = makeTraderDespawn();
    tickTraderDespawn(s, TRADER_LIFESPAN_SEC);
    const r = tickTraderDespawn(s, 1);
    expect(r.despawnNow).toBe(false);
  });

  it('force despawn skips the timer', () => {
    const s = makeTraderDespawn();
    expect(forceDespawn(s)).toBe(true);
    expect(s.despawned).toBe(true);
    expect(s.remainingSec).toBe(0);
  });

  it('force despawn is idempotent', () => {
    const s = makeTraderDespawn();
    forceDespawn(s);
    expect(forceDespawn(s)).toBe(false);
  });
});
