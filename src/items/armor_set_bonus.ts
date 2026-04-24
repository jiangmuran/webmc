export type ArmorSlot = 'helmet' | 'chestplate' | 'leggings' | 'boots';

export interface ArmorPiece {
  slot: ArmorSlot;
  material: 'leather' | 'chainmail' | 'iron' | 'golden' | 'diamond' | 'netherite' | 'turtle';
  protection: number;
  toughness: number;
  knockbackResistance: number;
}

export function totalProtection(pieces: readonly ArmorPiece[]): number {
  return pieces.reduce((s, p) => s + p.protection, 0);
}

export function totalToughness(pieces: readonly ArmorPiece[]): number {
  return pieces.reduce((s, p) => s + p.toughness, 0);
}

export function totalKbResist(pieces: readonly ArmorPiece[]): number {
  return pieces.reduce((s, p) => s + p.knockbackResistance, 0);
}

export function damageWithArmor(raw: number, armor: number, toughness: number): number {
  const factor = 1 - Math.min(20, Math.max(armor / 5, armor - (4 * raw) / (toughness + 8))) / 25;
  return raw * factor;
}
