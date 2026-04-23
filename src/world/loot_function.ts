// Loot functions transform loot entries (set count, apply enchants).

export interface LootStack {
  id: string;
  count: number;
  enchantments: { id: string; level: number }[];
  nbt: Record<string, unknown>;
}

export type LootFunction =
  | { kind: 'set_count'; min: number; max: number }
  | { kind: 'looting_enchant'; bonusMin: number; bonusMax: number; lootingLevel: number }
  | { kind: 'apply_enchant'; id: string; level: number }
  | { kind: 'furnace_smelt'; mapping: Record<string, string> }
  | { kind: 'set_damage_pct'; pct: number };

export function apply(fn: LootFunction, stack: LootStack, rand: () => number): LootStack {
  switch (fn.kind) {
    case 'set_count': {
      const c = fn.min + Math.floor(rand() * (fn.max - fn.min + 1));
      return { ...stack, count: c };
    }
    case 'looting_enchant': {
      const bonus = fn.bonusMin + Math.floor(rand() * (fn.bonusMax - fn.bonusMin + 1));
      return { ...stack, count: stack.count + bonus * fn.lootingLevel };
    }
    case 'apply_enchant':
      return { ...stack, enchantments: [...stack.enchantments, { id: fn.id, level: fn.level }] };
    case 'furnace_smelt': {
      const next = fn.mapping[stack.id];
      if (!next) return stack;
      return { ...stack, id: next };
    }
    case 'set_damage_pct':
      return { ...stack, nbt: { ...stack.nbt, damagePct: fn.pct } };
  }
}
