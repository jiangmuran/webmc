import { describe, it, expect } from 'vitest';
import { type Villager, buildOffersFor, executeTrade, villagerLevelUp } from './villager';

const names = [
  'webmc:emerald',
  'webmc:wheat',
  'webmc:bread',
  'webmc:book',
  'webmc:iron_pickaxe',
  'webmc:iron_ingot',
  'webmc:raw_beef',
  'webmc:cooked_beef',
  'webmc:stick',
  'webmc:arrow',
];
const ids = new Map(names.map((n, i) => [n, i + 1]));
const resolve = (name: string): number | undefined => ids.get(name);

function farmer(): Villager {
  return {
    id: 1,
    profession: 'farmer',
    level: 1,
    experience: 0,
    offers: buildOffersFor('farmer', resolve),
  };
}

describe('villager', () => {
  it('buildOffersFor resolves item names to ids', () => {
    const v = farmer();
    expect(v.offers.length).toBe(2);
    expect(v.offers[0]?.input[0]?.itemId).toBe(ids.get('webmc:emerald'));
  });

  it('executeTrade succeeds when inputs match', () => {
    const v = farmer();
    const emeraldId = ids.get('webmc:emerald');
    if (emeraldId === undefined) throw new Error('missing emerald id');
    const r = executeTrade(v, 0, [{ itemId: emeraldId, count: 1, damage: 0 }]);
    expect(r.ok).toBe(true);
    expect(r.output?.itemId).toBe(ids.get('webmc:wheat'));
    expect(v.offers[0]?.uses).toBe(1);
  });

  it('executeTrade fails with wrong item', () => {
    const v = farmer();
    const stickId = ids.get('webmc:stick');
    if (stickId === undefined) throw new Error('missing stick id');
    const r = executeTrade(v, 0, [{ itemId: stickId, count: 1, damage: 0 }]);
    expect(r.ok).toBe(false);
  });

  it('offer locks after maxUses', () => {
    const v = farmer();
    const emeraldId = ids.get('webmc:emerald');
    if (emeraldId === undefined) throw new Error('missing emerald id');
    const offer = v.offers[0];
    if (!offer) throw new Error('no offer');
    for (let i = 0; i < offer.maxUses; i++) {
      executeTrade(v, 0, [{ itemId: emeraldId, count: 1, damage: 0 }]);
    }
    expect(offer.locked).toBe(true);
    const r = executeTrade(v, 0, [{ itemId: emeraldId, count: 1, damage: 0 }]);
    expect(r.ok).toBe(false);
  });

  it('villagerLevelUp advances at XP threshold and unlocks offers', () => {
    const v = farmer();
    const offer = v.offers[0];
    if (offer) offer.locked = true;
    v.experience = 100;
    expect(villagerLevelUp(v)).toBe(true);
    expect(v.level).toBe(2);
    expect(offer?.locked).toBe(false);
  });
});
