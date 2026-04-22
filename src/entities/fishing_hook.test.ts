import { describe, it, expect } from 'vitest';
import { makeFishingHook, reelIn, tickFishingHook } from './fishing_hook';

describe('fishing hook', () => {
  it('starts in flight', () => {
    const h = makeFishingHook(1, 'p1', { x: 0, y: 64, z: 0 }, { x: 0, y: 0, z: 1 });
    expect(h.phase).toBe('in_flight');
  });

  it('lands on water = bobbing', () => {
    const h = makeFishingHook(1, 'p1', { x: 0, y: 64, z: 0 }, { x: 0, y: -1, z: 0 });
    tickFishingHook(h, {
      isWater: () => true,
      isSolid: () => false,
      nearbyEntities: [],
      dtSec: 0.5,
      rng: () => 0.5,
    });
    expect(h.phase).toBe('bobbing');
  });

  it('hooks entity in flight', () => {
    const h = makeFishingHook(1, 'p1', { x: 0, y: 64, z: 0 }, { x: 1, y: 0, z: 0 });
    const r = tickFishingHook(h, {
      isWater: () => false,
      isSolid: () => false,
      nearbyEntities: [{ id: 99, pos: { x: 0.1, y: 64, z: 0 } }],
      dtSec: 0.1,
      rng: () => 0.5,
    });
    expect(r.entityHit).toBe(99);
    expect(h.phase).toBe('hooked_entity');
  });

  it('bite fires after wait', () => {
    const h = makeFishingHook(1, 'p1', { x: 0, y: 64, z: 0 }, { x: 0, y: -1, z: 0 });
    h.phase = 'bobbing';
    h.ticksUntilBite = 1;
    const r = tickFishingHook(h, {
      isWater: () => true,
      isSolid: () => false,
      nearbyEntities: [],
      dtSec: 0.05,
      rng: () => 0.5,
    });
    expect(r.biteReady).toBe(true);
  });

  it('reel with bite yields fish', () => {
    const h = makeFishingHook(1, 'p1', { x: 0, y: 64, z: 0 }, { x: 0, y: 0, z: 1 });
    const r = reelIn({
      hook: h,
      ownerPos: { x: 0, y: 64, z: 0 },
      biteReady: true,
      lureLevel: 0,
    });
    expect(r.caughtItem).toBeTruthy();
  });

  it('reel on hooked entity pulls it', () => {
    const h = makeFishingHook(1, 'p1', { x: 5, y: 64, z: 0 }, { x: 1, y: 0, z: 0 });
    h.phase = 'hooked_entity';
    const r = reelIn({
      hook: h,
      ownerPos: { x: 0, y: 64, z: 0 },
      biteReady: false,
      lureLevel: 0,
    });
    expect(r.pulledEntityDelta?.x ?? 0).toBeLessThan(0);
  });
});
