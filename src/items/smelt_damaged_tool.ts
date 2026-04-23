// Smelting damaged iron/gold tools yields a nugget. Netherite cannot
// be smelted (indestructible material).

export interface SmeltInput {
  id: string;
  damagePct: number;
}

export function canSmeltTool(input: SmeltInput): boolean {
  if (input.id.startsWith('netherite_')) return false;
  return (
    input.id.startsWith('iron_') ||
    input.id.startsWith('gold_') ||
    input.id.startsWith('chainmail_')
  );
}

export function nuggetYield(input: SmeltInput): string | null {
  if (!canSmeltTool(input)) return null;
  if (input.id.startsWith('iron_') || input.id.startsWith('chainmail_')) return 'iron_nugget';
  if (input.id.startsWith('gold_')) return 'gold_nugget';
  return null;
}

export function xpPerSmelt(): number {
  return 0.1;
}
