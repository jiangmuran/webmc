// Dispenser behavior (item drop variant). The dispenser has 9 slots;
// on pulse, a random non-empty slot is chosen; its contents are either
// activated (arrows, potions, boats) or dropped as an entity.

export interface DispenserItem {
  id: string;
  count: number;
}

export interface DispenserSlot {
  item: DispenserItem | null;
}

export interface DispenserQuery {
  slots: DispenserSlot[];
  rand: () => number;
}

export interface DispenseResult {
  slotIndex: number;
  action: 'drop' | 'activate' | 'empty';
  item: DispenserItem | null;
}

const ACTIVATE_IDS = new Set<string>([
  'webmc:arrow',
  'webmc:spectral_arrow',
  'webmc:tipped_arrow',
  'webmc:splash_potion',
  'webmc:lingering_potion',
  'webmc:fire_charge',
  'webmc:snowball',
  'webmc:egg',
  'webmc:ender_pearl',
  'webmc:experience_bottle',
  'webmc:bucket',
  'webmc:water_bucket',
  'webmc:lava_bucket',
  'webmc:tnt',
  'webmc:shulker_box',
]);

export function dispense(q: DispenserQuery): DispenseResult {
  const nonEmpty = q.slots
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => s.item !== null && s.item.count > 0);
  if (nonEmpty.length === 0) return { slotIndex: -1, action: 'empty', item: null };
  const picked = nonEmpty[Math.floor(q.rand() * nonEmpty.length)];
  if (!picked) return { slotIndex: -1, action: 'empty', item: null };
  const { s, i } = picked;
  const item = s.item;
  if (!item) return { slotIndex: -1, action: 'empty', item: null };
  const out: DispenserItem = { id: item.id, count: 1 };
  item.count -= 1;
  if (item.count <= 0) s.item = null;
  return {
    slotIndex: i,
    action: ACTIVATE_IDS.has(out.id) ? 'activate' : 'drop',
    item: out,
  };
}
