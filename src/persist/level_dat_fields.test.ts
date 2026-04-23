import { describe, it, expect } from 'vitest';
import { sanitizeForImport, extractSeedDigest } from './level_dat_fields';

describe('level dat fields', () => {
  it('defaults reasonable', () => {
    const r = sanitizeForImport({});
    expect(r.seed).toBe('0');
    expect(r.difficulty).toBe('normal');
    expect(r.spawnY).toBe(64);
  });

  it('preserves seed', () => {
    expect(sanitizeForImport({ seed: '42' }).seed).toBe('42');
  });

  it('always rebrands generator', () => {
    expect(sanitizeForImport({ generatorName: 'MINECRAFT:default' }).generatorName).toBe(
      'webmc_default',
    );
  });

  it('dayTime wraps', () => {
    expect(sanitizeForImport({ dayTime: 26000 }).dayTime).toBe(2000);
    expect(sanitizeForImport({ dayTime: -500 }).dayTime).toBe(23500);
  });

  it('numeric seed passthrough', () => {
    expect(extractSeedDigest('-12345')).toBe('-12345');
  });

  it('string seed hashed', () => {
    expect(extractSeedDigest('hello')).toMatch(/-?\d+/);
  });
});
