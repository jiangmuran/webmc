import { describe, it, expect } from 'vitest';
import { defaults, validate, applyOverrides, OPTIONS } from './options_panel';

describe('options panel', () => {
  it('defaults returns full set', () => {
    const d = defaults();
    expect(Object.keys(d).length).toBe(OPTIONS.length);
  });

  it('validate number bounds', () => {
    expect(validate('fov', 70)).toBe(true);
    expect(validate('fov', 1000)).toBe(false);
    expect(validate('fov', 'x')).toBe(false);
  });

  it('validate bool', () => {
    expect(validate('invert_y', true)).toBe(true);
    expect(validate('invert_y', 1)).toBe(false);
  });

  it('validate enum', () => {
    expect(validate('particles', 'all')).toBe(true);
    expect(validate('particles', 'full')).toBe(false);
  });

  it('apply overrides rejects invalid', () => {
    const base = defaults();
    const over = { fov: 500, sensitivity: 0.5 };
    const out = applyOverrides(base, over);
    expect(out.fov).toBe(base.fov);
    expect(out.sensitivity).toBe(0.5);
  });
});
