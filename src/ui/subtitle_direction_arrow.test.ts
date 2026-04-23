import { describe, it, expect } from 'vitest';
import {
  directionToSource,
  isVisible,
  dedupeById,
  type SubtitleSpec,
} from './subtitle_direction_arrow';

const s: SubtitleSpec = {
  id: 'zombie',
  name: 'Zombie growls',
  sourceX: 10,
  sourceZ: 0,
  expiresAtMs: 1000,
};

describe('subtitle direction arrow', () => {
  it('east when facing east', () => {
    expect(directionToSource(s, 0, 0, 0)).toBeCloseTo(0);
  });

  it('behind when facing east', () => {
    const behind = { ...s, sourceX: -10 };
    expect(Math.abs(directionToSource(behind, 0, 0, 0))).toBeCloseTo(Math.PI);
  });

  it('visible before expiry', () => {
    expect(isVisible(s, 500)).toBe(true);
  });

  it('hidden after expiry', () => {
    expect(isVisible(s, 2000)).toBe(false);
  });

  it('dedupe by id', () => {
    const latest = { ...s, expiresAtMs: 5000 };
    expect(dedupeById([s, latest])).toEqual([latest]);
  });
});
