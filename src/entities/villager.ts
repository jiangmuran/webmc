// Villager trade offers — JSON-style recipe list per profession. Each offer
// has input item(s), output item, remaining uses, and a price-multiplier that
// grows slightly with use to reflect inflation.

import type { ItemStack } from '@/items/item';

export type VillagerProfession =
  | 'farmer'
  | 'librarian'
  | 'blacksmith'
  | 'butcher'
  | 'fletcher'
  | 'none';

export interface TradeOffer {
  readonly input: readonly ItemStack[];
  readonly output: ItemStack;
  uses: number;
  maxUses: number;
  priceMultiplier: number;
  locked: boolean;
}

export interface Villager {
  id: number;
  profession: VillagerProfession;
  level: number; // 1-5: novice, apprentice, journeyman, expert, master
  experience: number;
  offers: TradeOffer[];
}

export const VILLAGER_LEVEL_XP: readonly number[] = [0, 10, 70, 150, 250];

function makeOffer(input: ItemStack[], output: ItemStack, maxUses = 12): TradeOffer {
  return { input, output, uses: 0, maxUses, priceMultiplier: 0, locked: false };
}

function stack(itemName: string, count: number): ItemStack {
  // ItemStack carries itemId; caller swaps in the right id at spawn-time.
  // For the trade table we key on item name and resolve via a registry map.
  return { itemId: -1, count, damage: 0, __name: itemName } as unknown as ItemStack;
}

export type NamedStack = ItemStack & { __name?: string };

// Base offers per profession. Resolved at villager spawn time via a name→itemId map.
export const PROFESSION_OFFERS: Record<VillagerProfession, readonly NamedStack[][]> = {
  farmer: [
    [stack('webmc:emerald', 1), stack('webmc:wheat', 20)],
    [stack('webmc:emerald', 1), stack('webmc:bread', 6)],
  ] as NamedStack[][],
  librarian: [
    [stack('webmc:emerald', 5), stack('webmc:book', 1)],
    [stack('webmc:book', 3), stack('webmc:emerald', 1)],
  ] as NamedStack[][],
  blacksmith: [
    [stack('webmc:emerald', 10), stack('webmc:iron_pickaxe', 1)],
    [stack('webmc:emerald', 5), stack('webmc:iron_ingot', 4)],
  ] as NamedStack[][],
  butcher: [
    [stack('webmc:raw_beef', 14), stack('webmc:emerald', 1)],
    [stack('webmc:emerald', 1), stack('webmc:cooked_beef', 6)],
  ] as NamedStack[][],
  fletcher: [
    [stack('webmc:stick', 32), stack('webmc:emerald', 1)],
    [stack('webmc:emerald', 1), stack('webmc:arrow', 16)],
  ] as NamedStack[][],
  none: [] as NamedStack[][],
};

export function buildOffersFor(
  profession: VillagerProfession,
  resolveId: (name: string) => number | undefined,
): TradeOffer[] {
  return PROFESSION_OFFERS[profession].map((pair) => {
    const inputs = pair.slice(0, pair.length - 1);
    const last = pair[pair.length - 1];
    if (!last) throw new Error('villager: malformed trade pair');
    const toStack = (s: NamedStack): ItemStack => {
      const id = resolveId(s.__name ?? '') ?? 0;
      return { itemId: id, count: s.count, damage: 0 };
    };
    return makeOffer(
      inputs.map((s) => toStack(s)),
      toStack(last),
    );
  });
}

// Execute a trade. Returns true if input matched; caller is responsible for
// actually removing inputs + delivering output to inventories. Locks the
// offer when uses == maxUses.
export function executeTrade(
  v: Villager,
  offerIdx: number,
  offered: readonly ItemStack[],
): { ok: boolean; output?: ItemStack } {
  const offer = v.offers[offerIdx];
  if (!offer || offer.locked) return { ok: false };
  if (offered.length !== offer.input.length) return { ok: false };
  for (let i = 0; i < offer.input.length; i++) {
    const want = offer.input[i];
    const have = offered[i];
    if (!want || !have) return { ok: false };
    if (want.itemId !== have.itemId) return { ok: false };
    if (have.count < want.count) return { ok: false };
  }
  offer.uses++;
  v.experience += 2;
  if (offer.uses >= offer.maxUses) offer.locked = true;
  return { ok: true, output: offer.output };
}

export function villagerLevelUp(v: Villager): boolean {
  const next = VILLAGER_LEVEL_XP[v.level];
  if (next !== undefined && v.experience >= next && v.level < 5) {
    v.level++;
    for (const o of v.offers) o.locked = false;
    return true;
  }
  return false;
}
