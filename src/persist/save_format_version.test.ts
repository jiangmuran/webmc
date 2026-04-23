import { describe, it, expect } from 'vitest';
import { isCompatible, needsUpgrade, stamp, CURRENT_FORMAT_VERSION } from './save_format_version';

const h = {
  formatVersion: 1,
  gameVersion: '0.1.0',
  createdAt: 0,
  lastPlayedAt: 0,
};

describe('save format version', () => {
  it('compat when version <= current', () => {
    expect(isCompatible(h)).toBe(true);
  });

  it('needs upgrade below current', () => {
    expect(needsUpgrade(h)).toBe(true);
  });

  it('not compat for version 0', () => {
    expect(isCompatible({ ...h, formatVersion: 0 })).toBe(false);
  });

  it('stamp bumps', () => {
    expect(stamp(h).formatVersion).toBe(CURRENT_FORMAT_VERSION);
  });
});
