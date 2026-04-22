import { describe, it, expect } from 'vitest';
import {
  onStepOn,
  shouldSpawnRose,
  WITHER_LEVEL,
  WITHER_DURATION_TICKS,
} from './wither_rose_spawn';

describe('wither rose', () => {
  it('applies wither on step', () => {
    const r = onStepOn({ standingOn: 'webmc:wither_rose', inCreative: false });
    expect(r.applied).toBe(true);
    expect(r.amplifier).toBe(WITHER_LEVEL);
    expect(r.durationTicks).toBe(WITHER_DURATION_TICKS);
  });

  it('creative skip', () => {
    expect(onStepOn({ standingOn: 'webmc:wither_rose', inCreative: true }).applied).toBe(false);
  });

  it('non-rose ignored', () => {
    expect(onStepOn({ standingOn: 'other', inCreative: false }).applied).toBe(false);
  });

  it('spawn on wither death', () => {
    expect(shouldSpawnRose({ killedByWitherBoss: true, surfaceBlockReplaceable: true })).toBe(true);
  });

  it('no spawn on non-wither kill', () => {
    expect(shouldSpawnRose({ killedByWitherBoss: false, surfaceBlockReplaceable: true })).toBe(
      false,
    );
  });
});
