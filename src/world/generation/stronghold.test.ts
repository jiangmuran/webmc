import { describe, it, expect } from 'vitest';
import { hasPortalRoom, planStronghold, STRONGHOLD_ROOMS } from './stronghold';

describe('stronghold', () => {
  it('first room is a corridor', () => {
    const p = planStronghold({ rng: () => 0.5, targetRoomCount: 10 });
    expect(p[0]?.kind).toBe('corridor');
  });

  it('always has a portal room', () => {
    const p = planStronghold({ rng: () => 0.5, targetRoomCount: 10 });
    expect(hasPortalRoom(p)).toBe(true);
  });

  it('library has max count 1', () => {
    const p = planStronghold({ rng: () => 0.5, targetRoomCount: 100 });
    const libs = p.filter((r) => r.kind === 'library_small').length;
    expect(libs).toBeLessThanOrEqual(1);
  });

  it('respects targetRoomCount (± portal room)', () => {
    const p = planStronghold({ rng: () => 0.5, targetRoomCount: 10 });
    expect(p.length).toBeLessThanOrEqual(11);
  });

  it('portal room has weight 0 and is placed explicitly', () => {
    expect(STRONGHOLD_ROOMS.portal_room.weight).toBe(0);
  });
});
