// Smelting damaged iron/gold tools yields a nugget. Netherite cannot
// be smelted (indestructible material).
//
// Vanilla MC tool/armor IDs use `golden_*` while webmc's armor
// registry uses `gold_*` — accept both spellings so smelting works
// regardless of which form a caller passes.

export interface SmeltInput {
  id: string;
  damagePct: number;
}

function isGold(id: string): boolean {
  return id.startsWith('gold_') || id.startsWith('golden_');
}

export function canSmeltTool(input: SmeltInput): boolean {
  if (input.id.startsWith('netherite_')) return false;
  return input.id.startsWith('iron_') || isGold(input.id) || input.id.startsWith('chainmail_');
}

export function nuggetYield(input: SmeltInput): string | null {
  if (!canSmeltTool(input)) return null;
  if (input.id.startsWith('iron_') || input.id.startsWith('chainmail_')) return 'iron_nugget';
  if (isGold(input.id)) return 'gold_nugget';
  return null;
}

export function xpPerSmelt(): number {
  return 0.1;
}
