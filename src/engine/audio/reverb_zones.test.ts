import { describe, it, expect } from 'vitest';
import { wetness, dryness } from './reverb_zones';

describe('reverb zones', () => {
  it('open is dry', () => {
    expect(wetness('open')).toBe(0);
  });

  it('cave is echoey', () => {
    expect(wetness('cave')).toBeGreaterThan(0.5);
  });

  it('dryness complements', () => {
    expect(dryness('open') + wetness('open')).toBe(1);
  });
});
