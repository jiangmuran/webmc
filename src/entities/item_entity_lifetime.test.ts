import { describe, it, expect } from 'vitest';
import {
  canPickUp,
  tick,
  shouldDespawn,
  mergeWith,
  ITEM_DESPAWN_TICKS,
  type ItemEntity,
} from './item_entity_lifetime';

const base: ItemEntity = { id: 'apple', count: 1, ageTicks: 0, pickupDelay: 0 };

describe('item entity lifetime', () => {
  it('pickup allowed with no delay', () => {
    expect(canPickUp(base, 'alice')).toBe(true);
  });

  it('pickup blocked by delay', () => {
    expect(canPickUp({ ...base, pickupDelay: 5 }, 'alice')).toBe(false);
  });

  it('owner-restricted rejects others', () => {
    expect(canPickUp({ ...base, canBePickedUpBy: 'alice' }, 'bob')).toBe(false);
    expect(canPickUp({ ...base, canBePickedUpBy: 'alice' }, 'alice')).toBe(true);
  });

  it('tick ages', () => {
    expect(tick(base).ageTicks).toBe(1);
  });

  it('tick drains delay', () => {
    expect(tick({ ...base, pickupDelay: 3 }).pickupDelay).toBe(2);
  });

  it('despawns at lifetime', () => {
    expect(shouldDespawn({ ...base, ageTicks: ITEM_DESPAWN_TICKS })).toBe(true);
  });

  it('merge stacks same id', () => {
    const r = mergeWith(base, { ...base, count: 5 }, 64);
    expect(r?.count).toBe(6);
  });

  it('merge rejects mismatched ids', () => {
    expect(mergeWith(base, { ...base, id: 'stone' }, 64)).toBeUndefined();
  });

  it('merge rejects overflow', () => {
    expect(mergeWith({ ...base, count: 60 }, { ...base, count: 60 }, 64)).toBeUndefined();
  });
});
