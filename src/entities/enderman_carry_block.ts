export interface EndermanCarry {
  heldBlock?: string;
}

export const MAX_CARRY_DISTANCE = 32;

export function droppingBlockAtDeath(c: EndermanCarry): string | undefined {
  return c.heldBlock;
}

export function silentPickupChance(): number {
  return 0.006;
}

export function cannotCarryOverClass(): string[] {
  return ['obsidian', 'bedrock'];
}
