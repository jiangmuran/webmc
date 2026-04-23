// Mobs pick up nearby dropped items when the slot is empty and
// the candidate is a better weapon/armor.

export interface ItemStack {
  id: string;
  tier: number;
}

export interface MobLoadout {
  mainhand: ItemStack | null;
  helmet: ItemStack | null;
  chestplate: ItemStack | null;
  leggings: ItemStack | null;
  boots: ItemStack | null;
}

export function betterThan(incoming: ItemStack, existing: ItemStack | null): boolean {
  if (!existing) return true;
  return incoming.tier > existing.tier;
}

export function shouldPickUp(loadout: MobLoadout, item: ItemStack): keyof MobLoadout | null {
  const kind = item.id.split('_').at(-1);
  if (kind === 'sword' || kind === 'axe' || kind === 'bow') {
    return betterThan(item, loadout.mainhand) ? 'mainhand' : null;
  }
  if (item.id.endsWith('_helmet')) return betterThan(item, loadout.helmet) ? 'helmet' : null;
  if (item.id.endsWith('_chestplate'))
    return betterThan(item, loadout.chestplate) ? 'chestplate' : null;
  if (item.id.endsWith('_leggings')) return betterThan(item, loadout.leggings) ? 'leggings' : null;
  if (item.id.endsWith('_boots')) return betterThan(item, loadout.boots) ? 'boots' : null;
  return null;
}
