// Cauldron levels (0..3) for water / lava / powder snow. Filling: water
// bucket → 3 (instant fill). Bottle → +1. Empty via bucket (-3 if full)
// or bottle (-1). Potions fill with special content.

export type CauldronContent = 'empty' | 'water' | 'lava' | 'powder_snow' | 'potion';

export interface Cauldron {
  content: CauldronContent;
  level: number; // 0..3 (level 0 only for 'empty')
  potionSig: string | null;
}

export function makeCauldron(): Cauldron {
  return { content: 'empty', level: 0, potionSig: null };
}

export type FillSource =
  | { kind: 'water_bucket' }
  | { kind: 'lava_bucket' }
  | { kind: 'powder_snow_bucket' }
  | { kind: 'water_bottle' }
  | { kind: 'potion'; sig: string };

export function fill(c: Cauldron, src: FillSource): boolean {
  if (src.kind === 'water_bucket') {
    if (c.content !== 'empty' && c.content !== 'water') return false;
    c.content = 'water';
    c.level = 3;
    c.potionSig = null;
    return true;
  }
  if (src.kind === 'lava_bucket') {
    if (c.content !== 'empty' && c.content !== 'lava') return false;
    c.content = 'lava';
    c.level = 3;
    return true;
  }
  if (src.kind === 'powder_snow_bucket') {
    if (c.content !== 'empty' && c.content !== 'powder_snow') return false;
    c.content = 'powder_snow';
    c.level = 3;
    return true;
  }
  if (src.kind === 'water_bottle') {
    if (c.content === 'empty') {
      c.content = 'water';
      c.level = 1;
      return true;
    }
    if (c.content === 'water' && c.level < 3) {
      c.level += 1;
      return true;
    }
    return false;
  }
  // potion
  if (c.content !== 'empty' && !(c.content === 'potion' && c.potionSig === src.sig)) return false;
  c.content = 'potion';
  c.potionSig = src.sig;
  c.level = Math.min(3, c.level + 1);
  return true;
}

export function drawBottle(c: Cauldron): { content: CauldronContent; sig: string | null } | null {
  if (c.content === 'empty' || c.content === 'lava' || c.content === 'powder_snow') return null;
  if (c.level <= 0) return null;
  c.level -= 1;
  const out = { content: c.content, sig: c.potionSig };
  if (c.level === 0) {
    c.content = 'empty';
    c.potionSig = null;
  }
  return out;
}
