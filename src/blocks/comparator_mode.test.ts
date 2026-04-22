import { describe, it, expect } from 'vitest';
import { output, toggleMode, containerSignal } from './comparator_mode';

describe('comparator mode', () => {
  it('compare passes back when side ≤ back', () => {
    expect(output({ mode: 'compare', back: 10, sideMax: 5 })).toBe(10);
  });

  it('compare blocks when side > back', () => {
    expect(output({ mode: 'compare', back: 5, sideMax: 10 })).toBe(0);
  });

  it('subtract', () => {
    expect(output({ mode: 'subtract', back: 10, sideMax: 3 })).toBe(7);
  });

  it('subtract clamps 0', () => {
    expect(output({ mode: 'subtract', back: 3, sideMax: 10 })).toBe(0);
  });

  it('toggle mode', () => {
    expect(toggleMode('compare')).toBe('subtract');
    expect(toggleMode('subtract')).toBe('compare');
  });

  it('container empty 0', () => {
    expect(containerSignal(0, 64)).toBe(0);
  });

  it('container full 15', () => {
    expect(containerSignal(64, 64)).toBe(15);
  });

  it('container 1 → 1', () => {
    expect(containerSignal(1, 64)).toBe(1);
  });
});
