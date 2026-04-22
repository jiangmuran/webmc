// Anvil ops: repair (combine two of the same tool, sum durability),
// rename (apply custom name for 1 level), and merge enchants from the
// second stack into the first.

import { type Enchanted, applyEnchant, hasEnchant, ENCHANTMENTS } from './enchantment';

export interface AnvilInput {
  left: Enchanted;
  right: Enchanted | null; // null = name-only op
  newName?: string;
}

export interface AnvilResult {
  output: Enchanted;
  xpCost: number;
}

export function anvilCombine(input: AnvilInput): AnvilResult | null {
  const { left, right } = input;
  let output: Enchanted = { ...left };
  let xp = 0;

  if (right !== null) {
    if (right.itemId !== left.itemId) return null; // must match for repair/merge
    if (left.damage > 0) {
      const repair = Math.min(left.damage, Math.max(1, Math.floor(right.damage / 4) || 1));
      output = { ...output, damage: left.damage - repair };
      xp += 2;
    }
    if (right.enchants) {
      for (const [id, rLevel] of right.enchants) {
        const cur = hasEnchant(left, id);
        const cap = ENCHANTMENTS[id]?.maxLevel ?? rLevel;
        let next = rLevel;
        if (cur === rLevel && cur < cap) next = cur + 1;
        else if (cur > rLevel) next = cur;
        output = applyEnchant(output, id, next);
        xp += next;
      }
    }
  }

  if (input.newName !== undefined) {
    output = { ...output, name: input.newName };
    xp += 1;
  }

  return { output, xpCost: xp };
}
