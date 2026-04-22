import { describe, it, expect } from 'vitest';
import {
  makeTraderLlama,
  trySpit,
  release,
  SPIT_COOLDOWN_MS,
  DEFEND_RANGE,
} from './trader_llama_defense';

describe('trader llama', () => {
  it('spits at nearby hostile when threatened', () => {
    const l = makeTraderLlama('trader1');
    const r = trySpit(l, {
      nowMs: 0,
      hostileNear: { id: 'zombie1', distance: 5 },
      traderThreatened: true,
    });
    expect(r).toBe('zombie1');
  });

  it('no threat = no spit', () => {
    const l = makeTraderLlama('trader1');
    expect(
      trySpit(l, {
        nowMs: 0,
        hostileNear: { id: 'z', distance: 5 },
        traderThreatened: false,
      }),
    ).toBeNull();
  });

  it('range', () => {
    const l = makeTraderLlama('trader1');
    expect(
      trySpit(l, {
        nowMs: 0,
        hostileNear: { id: 'z', distance: DEFEND_RANGE + 1 },
        traderThreatened: true,
      }),
    ).toBeNull();
  });

  it('cooldown', () => {
    const l = makeTraderLlama('trader1');
    trySpit(l, { nowMs: 0, hostileNear: { id: 'z', distance: 5 }, traderThreatened: true });
    expect(
      trySpit(l, { nowMs: 100, hostileNear: { id: 'z', distance: 5 }, traderThreatened: true }),
    ).toBeNull();
    expect(
      trySpit(l, {
        nowMs: SPIT_COOLDOWN_MS + 1,
        hostileNear: { id: 'z', distance: 5 },
        traderThreatened: true,
      }),
    ).toBe('z');
  });

  it('release clears leash', () => {
    const l = makeTraderLlama('trader1');
    release(l);
    expect(l.leashedToTraderId).toBeNull();
  });
});
