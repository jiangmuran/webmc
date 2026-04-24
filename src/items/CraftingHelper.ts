import type { Inventory } from './Inventory';
import type { Recipe } from './recipe';

export interface RequiredIngredient {
  itemId: number;
  count: number;
}

export function requiredIngredients(recipe: Recipe): RequiredIngredient[] {
  const counts = new Map<number, number>();
  if (recipe.kind === 'shaped') {
    for (const row of recipe.pattern) {
      for (const cell of row) {
        if (cell === null) continue;
        counts.set(cell, (counts.get(cell) ?? 0) + 1);
      }
    }
  } else {
    for (const id of recipe.ingredients) {
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  const out: RequiredIngredient[] = [];
  for (const [itemId, count] of counts) out.push({ itemId, count });
  return out;
}

export function hasAllIngredients(inv: Inventory, recipe: Recipe): boolean {
  const needs = requiredIngredients(recipe);
  for (const n of needs) {
    if (countItem(inv, n.itemId) < n.count) return false;
  }
  return true;
}

function countItem(inv: Inventory, itemId: number): number {
  let total = 0;
  for (const s of inv.hotbar) if (s && s.itemId === itemId) total += s.count;
  for (const s of inv.main) if (s && s.itemId === itemId) total += s.count;
  return total;
}

function consume(inv: Inventory, itemId: number, count: number): boolean {
  let remaining = count;
  const consumeFrom = (slots: (typeof inv.hotbar)[number][]): void => {
    for (let i = 0; i < slots.length && remaining > 0; i++) {
      const s = slots[i];
      if (!s || s.itemId !== itemId) continue;
      const take = Math.min(s.count, remaining);
      const after = s.count - take;
      slots[i] = after <= 0 ? null : { ...s, count: after };
      remaining -= take;
    }
  };
  consumeFrom(inv.hotbar);
  if (remaining > 0) consumeFrom(inv.main);
  return remaining === 0;
}

export function attemptCraft(inv: Inventory, recipe: Recipe): boolean {
  if (!hasAllIngredients(inv, recipe)) return false;
  for (const need of requiredIngredients(recipe)) {
    if (!consume(inv, need.itemId, need.count)) return false;
  }
  inv.add({
    itemId: recipe.result.itemId,
    count: recipe.result.count,
    damage: recipe.result.damage,
  });
  return true;
}
