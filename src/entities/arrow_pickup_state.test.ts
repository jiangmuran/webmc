import { describe, it, expect } from 'vitest';
import { makeArrow, tickArrow, canPickup, DESPAWN_TICKS } from './arrow_pickup_state';

describe('arrow pickup', () => {
  it('allowed for survival shooter', () => {
    const a = makeArrow('Steve');
    a.inGround = true;
    expect(canPickup(a, { playerId: 'Steve', playerIsCreative: false, inventoryFull: false })).toBe(
      true,
    );
  });

  it('infinity bow denies pickup', () => {
    const a = makeArrow('Steve', true);
    a.inGround = true;
    expect(canPickup(a, { playerId: 'Steve', playerIsCreative: false, inventoryFull: false })).toBe(
      false,
    );
  });

  it('creative only', () => {
    const a = makeArrow('Steve', false, true);
    a.inGround = true;
    expect(canPickup(a, { playerId: 'Steve', playerIsCreative: false, inventoryFull: false })).toBe(
      false,
    );
    expect(canPickup(a, { playerId: 'Steve', playerIsCreative: true, inventoryFull: false })).toBe(
      true,
    );
  });

  it('in flight cannot pick up', () => {
    const a = makeArrow('Steve');
    expect(canPickup(a, { playerId: 'Steve', playerIsCreative: false, inventoryFull: false })).toBe(
      false,
    );
  });

  it('despawn after time', () => {
    const a = makeArrow('Steve');
    a.inGround = true;
    a.lifetimeTicks = DESPAWN_TICKS - 1;
    expect(tickArrow(a).despawned).toBe(true);
  });
});
