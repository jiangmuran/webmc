import { describe, it, expect } from 'vitest';
import { opForInputs, nextScale, requiresUnlocked, MAP_MAX_SCALE } from './cartography_zoom';

describe('cartography zoom', () => {
  it('map + paper = zoom_out', () => {
    const op = opForInputs('filled_map', 'paper', 2);
    expect(op.kind).toBe('zoom_out');
  });

  it('max scale rejects zoom', () => {
    expect(opForInputs('filled_map', 'paper', MAP_MAX_SCALE).kind).toBe('invalid');
  });

  it('map + empty = copy', () => {
    expect(opForInputs('filled_map', 'empty_map', 0).kind).toBe('copy');
  });

  it('map + glass = lock', () => {
    expect(opForInputs('filled_map', 'glass_pane', 0).kind).toBe('lock');
  });

  it('nextScale increments cap', () => {
    expect(nextScale(0)).toBe(1);
    expect(nextScale(MAP_MAX_SCALE)).toBe(MAP_MAX_SCALE);
  });

  it('zoom needs unlocked', () => {
    expect(requiresUnlocked({ kind: 'zoom_out', from: 0 })).toBe(true);
    expect(requiresUnlocked({ kind: 'copy' })).toBe(false);
  });
});
