import { describe, it, expect } from 'vitest';
import { craftMap, lockMap, zoomMap } from './map_zoom';

describe('map zoom', () => {
  it('zooms from scale 0 → 1 with 8 paper', () => {
    const r = zoomMap({ currentScale: 0, paperAvailable: 8 });
    expect(r.accepted).toBe(true);
    expect(r.newScale).toBe(1);
    expect(r.consumedPaper).toBe(8);
  });

  it('refuses without enough paper', () => {
    expect(zoomMap({ currentScale: 0, paperAvailable: 4 }).accepted).toBe(false);
  });

  it('cannot zoom past scale 4', () => {
    expect(zoomMap({ currentScale: 4, paperAvailable: 64 }).accepted).toBe(false);
  });
});

describe('map crafting', () => {
  it('paper + compass = filled map', () => {
    const r = craftMap({ paper: 8, compass: 1 });
    expect(r.kind).toBe('filled_map');
  });

  it('paper alone = empty map', () => {
    expect(craftMap({ paper: 8, compass: 0 }).kind).toBe('empty_map');
  });

  it('insufficient paper = refused', () => {
    expect(craftMap({ paper: 4, compass: 1 }).kind).toBe('refused');
  });

  it('lockMap preserves scale', () => {
    expect(lockMap({ scale: 3 }).scale).toBe(3);
  });
});
