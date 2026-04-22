import { describe, it, expect } from 'vitest';
import { useBed } from './bed_explode';

describe('bed', () => {
  it('sleeps at night in overworld', () => {
    expect(useBed({ dim: 'overworld', isNight: true, monstersNearby: false }).kind).toBe('sleep');
  });
  it('blocked by day', () => {
    expect(useBed({ dim: 'overworld', isNight: false, monstersNearby: false }).kind).toBe(
      'blocked_day',
    );
  });
  it('blocked by monsters', () => {
    expect(useBed({ dim: 'overworld', isNight: true, monstersNearby: true }).kind).toBe(
      'blocked_monsters',
    );
  });
  it('explodes in nether', () => {
    const r = useBed({ dim: 'nether', isNight: true, monstersNearby: false });
    expect(r.kind).toBe('explode');
    if (r.kind === 'explode') expect(r.power).toBe(5);
  });
  it('explodes in end', () => {
    expect(useBed({ dim: 'end', isNight: true, monstersNearby: false }).kind).toBe('explode');
  });
});
