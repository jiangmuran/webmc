import { describe, it, expect } from 'vitest';
import { output, togglesMode } from './comparator_subtract';

describe('comparator subtract', () => {
  it('subtract mode', () => {
    expect(output({ mode: 'subtract', rear: 10, leftSide: 4, rightSide: 3 })).toBe(6);
  });

  it('subtract floors at 0', () => {
    expect(output({ mode: 'subtract', rear: 2, leftSide: 10, rightSide: 0 })).toBe(0);
  });

  it('compare passes rear if >= side', () => {
    expect(output({ mode: 'compare', rear: 8, leftSide: 5, rightSide: 3 })).toBe(8);
  });

  it('compare kills when side > rear', () => {
    expect(output({ mode: 'compare', rear: 3, leftSide: 5, rightSide: 0 })).toBe(0);
  });

  it('mode toggles', () => {
    expect(togglesMode('compare')).toBe('subtract');
    expect(togglesMode('subtract')).toBe('compare');
  });
});
