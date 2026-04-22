import { describe, it, expect } from 'vitest';
import {
  BUNDLE_COLORS,
  bundleItemId,
  canStore,
  craftDyedBundle,
  isAnyBundle,
  parseBundleId,
} from './bundle_colors';

describe('bundle colors', () => {
  it('16 colors', () => {
    expect(BUNDLE_COLORS.length).toBe(16);
  });

  it('white bundle id is base', () => {
    expect(bundleItemId('white')).toBe('webmc:bundle');
  });

  it('colored bundle id', () => {
    expect(bundleItemId('red')).toBe('webmc:red_bundle');
  });

  it('parseBundleId round-trip', () => {
    expect(parseBundleId('webmc:bundle')).toBe('white');
    expect(parseBundleId('webmc:red_bundle')).toBe('red');
    expect(parseBundleId('webmc:xyz_bundle')).toBeNull();
  });

  it('craft dyed bundle', () => {
    const r = craftDyedBundle({ bundleColor: 'white', dye: 'red' });
    expect(r?.color).toBe('red');
  });

  it('cannot dye same color', () => {
    expect(craftDyedBundle({ bundleColor: 'red', dye: 'red' })).toBeNull();
  });

  it('isAnyBundle detects', () => {
    expect(isAnyBundle('webmc:red_bundle')).toBe(true);
    expect(isAnyBundle('webmc:stone')).toBe(false);
  });

  it('canStore rejects bundles-in-bundles', () => {
    expect(canStore('webmc:red_bundle')).toBe(false);
    expect(canStore('webmc:diamond')).toBe(true);
  });
});
