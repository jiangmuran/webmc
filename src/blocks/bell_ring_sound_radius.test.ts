import { describe, it, expect } from 'vitest';
import { ringEffects, audibleAt, ALERT_RADIUS, SOUND_RADIUS } from './bell_ring_sound_radius';

describe('bell ring', () => {
  it('highlights illagers', () => {
    const r = ringEffects({
      bellPos: { x: 0, y: 64, z: 0 },
      entities: [
        { id: 'pill', pos: { x: 5, y: 64, z: 0 }, kind: 'illager' },
        { id: 'vil', pos: { x: 10, y: 64, z: 0 }, kind: 'villager' },
        { id: 'cow', pos: { x: 0, y: 64, z: 0 }, kind: 'other' },
      ],
    });
    expect(r.highlightedIds).toEqual(['pill']);
    expect(r.villagersToShelter).toEqual(['vil']);
  });

  it('out of radius ignored', () => {
    const r = ringEffects({
      bellPos: { x: 0, y: 64, z: 0 },
      entities: [{ id: 'far', pos: { x: ALERT_RADIUS + 5, y: 64, z: 0 }, kind: 'illager' }],
    });
    expect(r.highlightedIds).toEqual([]);
  });

  it('audibility falls off', () => {
    expect(audibleAt(0)).toBe(1);
    expect(audibleAt(SOUND_RADIUS)).toBe(0);
    expect(audibleAt(SOUND_RADIUS + 10)).toBe(0);
  });
});
