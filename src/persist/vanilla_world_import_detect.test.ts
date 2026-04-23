import { describe, it, expect } from 'vitest';
import {
  isVanillaAnvilSave,
  isWebmcSave,
  detectFormat,
} from './vanilla_world_import_detect';

describe('world import detect', () => {
  const anvil = [{ name: 'level.dat' }, { name: 'region/r.0.0.mca' }];
  const webmc = [{ name: 'manifest.json' }, { name: 'chunk-0-0.blob' }];

  it('detects anvil', () => {
    expect(isVanillaAnvilSave(anvil)).toBe(true);
  });

  it('detects webmc', () => {
    expect(isWebmcSave(webmc)).toBe(true);
  });

  it('format dispatch', () => {
    expect(detectFormat(anvil)).toBe('anvil');
    expect(detectFormat(webmc)).toBe('webmc');
    expect(detectFormat([{ name: 'random.txt' }])).toBe('unknown');
  });
});
