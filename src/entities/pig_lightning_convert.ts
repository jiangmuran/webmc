// Pig struck by lightning → zombified piglin.
// Villager struck by lightning → witch.
// Creeper struck → charged creeper.

export interface StrikeResult {
  into: string | null;
  preserveEquipment: boolean;
}

const CONVERSIONS: Record<string, StrikeResult> = {
  pig: { into: 'zombified_piglin', preserveEquipment: false },
  villager: { into: 'witch', preserveEquipment: false },
  creeper: { into: null, preserveEquipment: true }, // stays a creeper but charged
  mooshroom: { into: null, preserveEquipment: true }, // toggles color
};

export function apply(mobType: string): StrikeResult {
  return CONVERSIONS[mobType] ?? { into: null, preserveEquipment: true };
}

export function chargesCreeper(mobType: string): boolean {
  return mobType === 'creeper';
}

export function damagedByLightning(entityType: string): boolean {
  return entityType !== 'skeleton_horse';
}
