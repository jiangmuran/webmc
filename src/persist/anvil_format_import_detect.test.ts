import { describe, it, expect } from 'vitest';
import {
  isAnvilWorld,
  signatureScore,
  needsUserConfirmation,
  type AnvilFingerprint,
} from './anvil_format_import_detect';

const full: AnvilFingerprint = {
  hasLevelDat: true,
  hasRegionFolder: true,
  hasPlayerdataFolder: true,
  hasDataFolder: true,
};

describe('anvil format import detect', () => {
  it('full anvil recognized', () => {
    expect(isAnvilWorld(full)).toBe(true);
  });

  it('no level.dat rejected', () => {
    expect(isAnvilWorld({ ...full, hasLevelDat: false })).toBe(false);
  });

  it('no region folder rejected', () => {
    expect(isAnvilWorld({ ...full, hasRegionFolder: false })).toBe(false);
  });

  it('full has high score', () => {
    expect(signatureScore(full)).toBe(100);
  });

  it('empty zero score', () => {
    expect(
      signatureScore({
        hasLevelDat: false,
        hasRegionFolder: false,
        hasPlayerdataFolder: false,
        hasDataFolder: false,
      }),
    ).toBe(0);
  });

  it('mid confidence asks user', () => {
    expect(
      needsUserConfirmation({
        hasLevelDat: true,
        hasRegionFolder: false,
        hasPlayerdataFolder: false,
        hasDataFolder: false,
      }),
    ).toBe(true);
  });
});
