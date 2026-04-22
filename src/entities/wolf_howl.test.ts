import { describe, it, expect } from 'vitest';
import { makeWolfHowlState, onOwnerDeath, tickWolf } from './wolf_howl';

describe('wolf howl', () => {
  it('howls when owner dies in earshot', () => {
    const w = makeWolfHowlState(42);
    const r = onOwnerDeath(w, { deadOwnerId: 42, killerId: 7, distanceToOwner: 5 });
    expect(r).toBe(true);
    expect(w.howlingSec).toBeGreaterThan(0);
    expect(w.hostileToId).toBe(7);
  });

  it('ignores when far from owner', () => {
    const w = makeWolfHowlState(42);
    expect(onOwnerDeath(w, { deadOwnerId: 42, killerId: 7, distanceToOwner: 100 })).toBe(false);
  });

  it("ignores other owners' deaths", () => {
    const w = makeWolfHowlState(42);
    expect(onOwnerDeath(w, { deadOwnerId: 5, killerId: 7, distanceToOwner: 1 })).toBe(false);
  });

  it('howl decays over time', () => {
    const w = makeWolfHowlState(42);
    onOwnerDeath(w, { deadOwnerId: 42, killerId: 7, distanceToOwner: 1 });
    tickWolf(w, 5);
    expect(w.howlingSec).toBe(0);
  });
});
