import { describe, it, expect } from 'vitest';
import {
  feedCookie,
  makeParrot,
  PARROT_VARIANTS,
  tickMimic,
  tryTame,
  updateDancing,
} from './parrot_mimic';

describe('parrot', () => {
  it('5 color variants', () => {
    expect(PARROT_VARIANTS.length).toBe(5);
  });

  it('tame succeeds on low roll', () => {
    const p = makeParrot(1, 'red_blue', { x: 0, y: 0, z: 0 });
    expect(tryTame(p, 'p1', 0.1)).toBe(true);
    expect(p.tamed).toBe(true);
  });

  it('tame fails on high roll', () => {
    const p = makeParrot(1, 'red_blue', { x: 0, y: 0, z: 0 });
    expect(tryTame(p, 'p1', 0.9)).toBe(false);
  });

  it('mimic fires rarely with nearby hostile', () => {
    expect(tickMimic({ nearbyHostileMob: 'zombie', roll: 0.001 })).toContain('zombie');
  });

  it('no mimic without hostile', () => {
    expect(tickMimic({ nearbyHostileMob: null, roll: 0.001 })).toBeNull();
  });

  it('dances near jukebox', () => {
    const p = makeParrot(1, 'green', { x: 0, y: 0, z: 0 });
    expect(updateDancing(p, { nearestJukebox: { x: 2, y: 0, z: 0 } })).toBe(true);
  });

  it('stops dancing when jukebox far', () => {
    const p = makeParrot(1, 'green', { x: 0, y: 0, z: 0 });
    expect(updateDancing(p, { nearestJukebox: { x: 20, y: 0, z: 0 } })).toBe(false);
  });

  it('cookie kills', () => {
    const p = makeParrot(1, 'red_blue', { x: 0, y: 0, z: 0 });
    expect(feedCookie(p).killed).toBe(true);
  });
});
