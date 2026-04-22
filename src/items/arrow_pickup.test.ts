import { describe, it, expect } from 'vitest';
import {
  ARROW_PICKUP_RADIUS,
  addStuckArrow,
  arrowPickupBehavior,
  MAX_STUCK_ARROWS,
  playerCanPickupArrow,
  removeStuckArrow,
} from './arrow_pickup';

describe('arrow pickup', () => {
  it('survival pickup to inventory', () => {
    expect(
      arrowPickupBehavior({
        firedBy: 'survival_player',
        hadInfinityOnBow: false,
        arrow: { kind: 'arrow' },
      }),
    ).toBe('add_to_inventory');
  });

  it('creative = no pickup', () => {
    expect(
      arrowPickupBehavior({
        firedBy: 'creative_player',
        hadInfinityOnBow: false,
        arrow: { kind: 'arrow' },
      }),
    ).toBe('no_pickup');
  });

  it('infinity = no pickup', () => {
    expect(
      arrowPickupBehavior({
        firedBy: 'survival_player',
        hadInfinityOnBow: true,
        arrow: { kind: 'arrow' },
      }),
    ).toBe('no_pickup');
  });

  it('tipped arrow returns original item', () => {
    expect(
      arrowPickupBehavior({
        firedBy: 'survival_player',
        hadInfinityOnBow: false,
        arrow: { kind: 'tipped_arrow' },
      }),
    ).toBe('add_original_item');
  });

  it('pickup within radius', () => {
    expect(playerCanPickupArrow({ x: 0, y: 0, z: 0 }, { x: 0.5, y: 0, z: 0 })).toBe(true);
  });

  it('far arrow = no pickup', () => {
    expect(playerCanPickupArrow({ x: 0, y: 0, z: 0 }, { x: 10, y: 0, z: 0 })).toBe(false);
  });

  it('pickup radius = 1.2', () => {
    expect(ARROW_PICKUP_RADIUS).toBe(1.2);
  });

  it('stuck arrows cap at 14', () => {
    const t = { count: 0 };
    for (let i = 0; i < 20; i++) addStuckArrow(t);
    expect(t.count).toBe(MAX_STUCK_ARROWS);
  });

  it('remove decrements', () => {
    const t = { count: 5 };
    removeStuckArrow(t);
    expect(t.count).toBe(4);
  });
});
