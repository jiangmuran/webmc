import { describe, it, expect } from 'vitest';
import { isValidManifest, pickCompatibleOverlay } from './datapack_schema_validate';

describe('datapack schema validate', () => {
  it('valid manifest', () => {
    expect(isValidManifest({ packFormat: 15, description: 'hi' })).toBe(true);
  });

  it('bad format', () => {
    expect(isValidManifest({ packFormat: 0, description: 'hi' })).toBe(false);
  });

  it('empty desc', () => {
    expect(isValidManifest({ packFormat: 15, description: '' })).toBe(false);
  });

  it('picks compatible overlay', () => {
    const o = [
      { name: 'modern', minFormat: 20, maxFormat: 30 },
      { name: 'legacy', minFormat: 1, maxFormat: 19 },
    ];
    expect(pickCompatibleOverlay(o, 25)).toBe('modern');
    expect(pickCompatibleOverlay(o, 5)).toBe('legacy');
    expect(pickCompatibleOverlay(o, 100)).toBeUndefined();
  });
});
