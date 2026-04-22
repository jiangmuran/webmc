import { describe, it, expect } from 'vitest';
import {
  bindCreaking,
  clearCreaking,
  damageHeart,
  makeCreakingHeart,
  shouldSpawnCreaking,
} from './creaking_heart';

describe('creaking heart', () => {
  it('spawns a creaking at night with a nearby player', () => {
    const h = makeCreakingHeart({ x: 0, y: 64, z: 0 });
    expect(shouldSpawnCreaking(h, { timeOfDay: 15000, playerNearby: true })).toBe(true);
  });

  it('does not spawn during the day', () => {
    const h = makeCreakingHeart({ x: 0, y: 64, z: 0 });
    expect(shouldSpawnCreaking(h, { timeOfDay: 6000, playerNearby: true })).toBe(false);
  });

  it('does not double-spawn once bound', () => {
    const h = makeCreakingHeart({ x: 0, y: 64, z: 0 });
    bindCreaking(h, 1);
    expect(shouldSpawnCreaking(h, { timeOfDay: 15000, playerNearby: true })).toBe(false);
  });

  it('clearCreaking frees the slot', () => {
    const h = makeCreakingHeart({ x: 0, y: 64, z: 0 });
    bindCreaking(h, 1);
    clearCreaking(h);
    expect(h.boundCreakingId).toBeNull();
    expect(h.active).toBe(false);
  });

  it('damage ≥12 destroys the heart', () => {
    const h = makeCreakingHeart({ x: 0, y: 64, z: 0 });
    const r = damageHeart(h, { amount: 12 });
    expect(r.heartDestroyed).toBe(true);
  });

  it('small damage does not destroy', () => {
    const h = makeCreakingHeart({ x: 0, y: 64, z: 0 });
    expect(damageHeart(h, { amount: 4 }).heartDestroyed).toBe(false);
  });
});
