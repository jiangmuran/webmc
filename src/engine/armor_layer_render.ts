// Armor layer rendering priority. Enchant glint on top of texture;
// armor trim on top of armor. Trim color tints follow material.

export interface ArmorLayers {
  helmet: string | null;
  chestplate: string | null;
  leggings: string | null;
  boots: string | null;
}

export interface ArmorGlint {
  hasEnchantOnAny: boolean;
}

export type DrawCall =
  | { kind: 'skin' }
  | { kind: 'armor'; slot: 'helmet' | 'chestplate' | 'leggings' | 'boots'; id: string }
  | { kind: 'trim'; slot: string; pattern: string; material: string }
  | { kind: 'glint' };

export function buildDrawList(
  layers: ArmorLayers,
  trims: { slot: string; pattern: string; material: string }[],
  glint: ArmorGlint,
): DrawCall[] {
  const out: DrawCall[] = [{ kind: 'skin' }];
  if (layers.boots) out.push({ kind: 'armor', slot: 'boots', id: layers.boots });
  if (layers.leggings) out.push({ kind: 'armor', slot: 'leggings', id: layers.leggings });
  if (layers.chestplate) out.push({ kind: 'armor', slot: 'chestplate', id: layers.chestplate });
  if (layers.helmet) out.push({ kind: 'armor', slot: 'helmet', id: layers.helmet });
  for (const t of trims)
    out.push({ kind: 'trim', slot: t.slot, pattern: t.pattern, material: t.material });
  if (glint.hasEnchantOnAny) out.push({ kind: 'glint' });
  return out;
}

export function armorRenderOrder(): ('boots' | 'leggings' | 'chestplate' | 'helmet')[] {
  return ['boots', 'leggings', 'chestplate', 'helmet'];
}
