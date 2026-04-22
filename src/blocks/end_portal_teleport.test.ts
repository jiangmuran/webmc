import { describe, it, expect } from 'vitest';
import {
  targetFor,
  refreshesEndPlatform,
  END_PLATFORM_CENTER,
  PLATFORM_CLEAR_VOLUME,
} from './end_portal_teleport';

describe('end portal teleport', () => {
  it('overworld → end', () => {
    const r = targetFor({ entityDimension: 'overworld' });
    expect(r.dimension).toBe('the_end');
    expect(r.x).toBe(END_PLATFORM_CENTER.x);
  });

  it('end → overworld', () => {
    const r = targetFor({ entityDimension: 'the_end' });
    expect(r.dimension).toBe('overworld');
  });

  it('refresh platform only going to end', () => {
    expect(refreshesEndPlatform(true)).toBe(true);
    expect(refreshesEndPlatform(false)).toBe(false);
  });

  it('clear volume 5x3x5', () => {
    expect(PLATFORM_CLEAR_VOLUME.w).toBe(5);
    expect(PLATFORM_CLEAR_VOLUME.h).toBe(3);
    expect(PLATFORM_CLEAR_VOLUME.d).toBe(5);
  });
});
