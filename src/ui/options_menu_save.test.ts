import { describe, it, expect } from 'vitest';
import { sanitize, isMinimal, DEFAULTS } from './options_menu_save';

describe('options menu save', () => {
  it('defaults sane', () => {
    expect(sanitize({})).toEqual(DEFAULTS);
  });

  it('fov clamps low', () => {
    expect(sanitize({ fov: 10 }).fov).toBe(30);
  });

  it('fov clamps high', () => {
    expect(sanitize({ fov: 200 }).fov).toBe(110);
  });

  it('minimal detection', () => {
    expect(isMinimal({ ...DEFAULTS, renderDistance: 4 })).toBe(true);
  });

  it('partial merge', () => {
    expect(sanitize({ invertMouse: true }).invertMouse).toBe(true);
  });
});
