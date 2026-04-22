import { describe, it, expect } from 'vitest';
import { nextAction } from './dispenser';
import type { ItemStack } from '@/items/item';

const items: Record<number, string> = {
  1: 'webmc:water_bucket',
  2: 'webmc:lava_bucket',
  3: 'webmc:arrow',
  4: 'webmc:tnt',
  5: 'webmc:stone',
};
const itemName = (id: number): string => items[id] ?? 'webmc:unknown';

function slots(...stacks: (ItemStack | null)[]): (ItemStack | null)[] {
  const out: (ItemStack | null)[] = Array.from({ length: 9 }, () => null);
  for (let i = 0; i < stacks.length; i++) out[i] = stacks[i] ?? null;
  return out;
}

describe('dispenser', () => {
  it('returns none when all slots empty', () => {
    const s = slots();
    expect(nextAction({ slots: s, rng: () => 0, itemName, isDispenser: true })).toEqual({
      kind: 'none',
    });
  });

  it('dropper drops whatever is in a slot', () => {
    const s = slots({ itemId: 5, count: 3, damage: 0 });
    const a = nextAction({ slots: s, rng: () => 0, itemName, isDispenser: false });
    expect(a.kind).toBe('drop');
  });

  it('dispenser places water when a water bucket is loaded', () => {
    const s = slots({ itemId: 1, count: 1, damage: 0 });
    const a = nextAction({ slots: s, rng: () => 0, itemName, isDispenser: true });
    expect(a.kind).toBe('place_fluid');
    if (a.kind === 'place_fluid') expect(a.fluid).toBe('water');
  });

  it('dispenser shoots an arrow when an arrow is loaded', () => {
    const s = slots({ itemId: 3, count: 1, damage: 0 });
    const a = nextAction({ slots: s, rng: () => 0, itemName, isDispenser: true });
    expect(a.kind).toBe('shoot_arrow');
  });

  it('dispenser ignites TNT', () => {
    const s = slots({ itemId: 4, count: 1, damage: 0 });
    const a = nextAction({ slots: s, rng: () => 0, itemName, isDispenser: true });
    expect(a.kind).toBe('ignite_tnt');
  });

  it('generic items place as a block', () => {
    const s = slots({ itemId: 5, count: 1, damage: 0 });
    const a = nextAction({ slots: s, rng: () => 0, itemName, isDispenser: true });
    expect(a.kind).toBe('place_block');
  });
});
