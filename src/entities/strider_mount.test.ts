import { describe, it, expect } from 'vitest';
import {
  dismountStrider,
  makeStrider,
  mountStrider,
  saddleStrider,
  tickStrider,
  useWarpedFungus,
} from './strider_mount';

describe('strider mount', () => {
  it('mounts only when saddled', () => {
    const s = makeStrider();
    expect(mountStrider(s, 1)).toBe(false);
    saddleStrider(s);
    expect(mountStrider(s, 1)).toBe(true);
  });

  it('shivers + takes damage in rain', () => {
    const s = makeStrider();
    const r = tickStrider(s, { inRain: true, inLava: false, dtSec: 1 });
    expect(s.shiveringInRain).toBe(true);
    expect(r.damageTaken).toBeGreaterThan(0);
  });

  it('no damage in lava', () => {
    const s = makeStrider();
    const r = tickStrider(s, { inRain: false, inLava: true, dtSec: 1 });
    expect(r.damageTaken).toBe(0);
  });

  it('dismount returns rider id', () => {
    const s = makeStrider();
    saddleStrider(s);
    mountStrider(s, 7);
    expect(dismountStrider(s)).toBe(7);
  });

  it('warped fungus needs saddle + rider', () => {
    const s = makeStrider();
    expect(useWarpedFungus(s).boosted).toBe(false);
    saddleStrider(s);
    mountStrider(s, 1);
    expect(useWarpedFungus(s).boosted).toBe(true);
  });
});
