import { describe, it, expect } from 'vitest';
import { directionLabel, subtitleLine } from './sound_subtitle';

describe('sound subtitle', () => {
  it('east', () => {
    expect(directionLabel({ source: 'x', dx: 10, dz: 0 })).toBe('E');
  });

  it('south', () => {
    expect(directionLabel({ source: 'x', dx: 0, dz: 10 })).toBe('S');
  });

  it('no subtitle undefined', () => {
    expect(subtitleLine({ source: 'x', dx: 1, dz: 0 })).toBeUndefined();
  });

  it('subtitle formats', () => {
    expect(subtitleLine({ source: 'x', subtitle: 'Zombie shuffles', dx: 10, dz: 0 })).toContain('E');
  });
});
