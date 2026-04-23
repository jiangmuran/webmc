// Item tooltip line assembly. Name (+color), custom name italic,
// enchantments, durability, lore lines, advanced (F3+H) block id.

export interface ItemTooltipCtx {
  displayName: string;
  customName: string | null;
  enchantments: { id: string; level: number }[];
  durability: { current: number; max: number } | null;
  lore: string[];
  blockId?: string;
  advancedTooltips: boolean;
}

export interface TooltipLine {
  text: string;
  style: 'plain' | 'italic' | 'gray' | 'blue' | 'green' | 'yellow';
}

export function build(ctx: ItemTooltipCtx): TooltipLine[] {
  const lines: TooltipLine[] = [];
  if (ctx.customName) lines.push({ text: ctx.customName, style: 'italic' });
  lines.push({ text: ctx.displayName, style: 'plain' });
  for (const e of ctx.enchantments) {
    lines.push({ text: `${e.id} ${toRoman(e.level)}`, style: 'gray' });
  }
  for (const l of ctx.lore) lines.push({ text: l, style: 'gray' });
  if (ctx.durability) {
    lines.push({
      text: `Durability: ${ctx.durability.current} / ${ctx.durability.max}`,
      style: 'yellow',
    });
  }
  if (ctx.advancedTooltips && ctx.blockId) {
    lines.push({ text: ctx.blockId, style: 'gray' });
  }
  return lines;
}

function toRoman(n: number): string {
  return ['', 'I', 'II', 'III', 'IV', 'V'][n] ?? String(n);
}
