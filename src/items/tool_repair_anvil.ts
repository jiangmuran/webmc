// Anvil tool repair. Combining two of same tool merges durabilities +
// 12% bonus; combining tool + material repairs 25% per unit.

export interface RepairInput {
  leftDurability: number;
  leftMax: number;
  rightDurability: number | null; // null = material
  rightMax: number | null;
  materialUnits: number;
}

export function mergedDurability(input: RepairInput): number {
  if (input.rightDurability === null || input.rightMax === null) {
    // Material repair: 25% per unit.
    const perUnit = Math.floor(input.leftMax * 0.25);
    return Math.min(input.leftMax, input.leftDurability + perUnit * input.materialUnits);
  }
  const bonus = Math.floor(input.leftMax * 0.12);
  const combined = input.leftDurability + input.rightDurability + bonus;
  return Math.min(input.leftMax, combined);
}

export const MAX_ANVIL_LEVEL_COST = 39;

export function materialsRequired(missingDurability: number, maxDurability: number): number {
  const perUnit = Math.floor(maxDurability * 0.25);
  return Math.max(1, Math.ceil(missingDurability / perUnit));
}
