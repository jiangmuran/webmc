import { describe, it, expect } from 'vitest';
import { MapDecorationTracker } from './map_decoration_tracker';

describe('map decoration tracker', () => {
  it('add + list', () => {
    const t = new MapDecorationTracker();
    t.add({
      id: 'x',
      kind: 'mansion',
      worldX: 0,
      worldZ: 0,
      yawDegrees: 0,
    });
    expect(t.all().length).toBe(1);
  });

  it('banner marker', () => {
    const t = new MapDecorationTracker();
    t.addBannerMarker(10, 20, 'red', 'Home');
    const d = t.all()[0];
    expect(d?.kind).toBe('banner_red');
    expect(d?.label).toBe('Home');
  });

  it('player marker updates in place', () => {
    const t = new MapDecorationTracker();
    t.updatePlayerMarker('p1', 0, 0, 0);
    t.updatePlayerMarker('p1', 10, 10, 90);
    expect(t.all().length).toBe(1);
    expect(t.all()[0]?.worldX).toBe(10);
  });

  it('inBounds filters', () => {
    const t = new MapDecorationTracker();
    t.updatePlayerMarker('p1', 100, 100, 0);
    t.updatePlayerMarker('p2', 5, 5, 0);
    const inBox = t.inBounds(0, 0, 10, 10);
    expect(inBox.length).toBe(1);
    expect(inBox[0]?.id).toBe('p2');
  });

  it('remove', () => {
    const t = new MapDecorationTracker();
    t.updatePlayerMarker('p1', 0, 0, 0);
    expect(t.remove('p1')).toBe(true);
    expect(t.all().length).toBe(0);
  });
});
