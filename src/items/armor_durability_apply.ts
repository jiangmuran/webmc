// Armor durability reduction per hit. 1 durability per 4 HP of damage,
// minimum 1. If durability reaches 0, armor is destroyed.

export interface ArmorPiece {
  id: string;
  durability: number;
  maxDurability: number;
}

export function cost(damageToPlayer: number): number {
  return Math.max(1, Math.floor(damageToPlayer / 4));
}

export function applyDamage(piece: ArmorPiece, damageToPlayer: number): ArmorPiece | null {
  const c = cost(damageToPlayer);
  const next = piece.durability - c;
  if (next <= 0) return null; // destroyed
  return { ...piece, durability: next };
}

export function isNearBreaking(piece: ArmorPiece): boolean {
  return piece.durability / piece.maxDurability <= 0.1;
}
