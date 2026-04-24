import { describe, it, expect } from 'vitest';
import {
  createDefault,
  isCurrent,
  touchLastPlayed,
  CURRENT_LEVEL_DAT_VERSION,
} from './level_dat_metadata';

describe('level.dat metadata', () => {
  it('creates with defaults', () => {
    const d = createDefault('MyWorld', 12345, 1000);
    expect(d.worldName).toBe('MyWorld');
    expect(d.seed).toBe(12345);
  });

  it('current version', () => {
    expect(isCurrent(createDefault('x', 0, 0))).toBe(true);
  });

  it('old rejected', () => {
    const d = createDefault('x', 0, 0);
    expect(isCurrent({ ...d, version: CURRENT_LEVEL_DAT_VERSION - 1 })).toBe(false);
  });

  it('touch updates time', () => {
    const d = createDefault('x', 0, 0);
    expect(touchLastPlayed(d, 9999).lastPlayedMs).toBe(9999);
  });

  it('default difficulty normal', () => {
    expect(createDefault('x', 0, 0).difficulty).toBe(2);
  });
});
