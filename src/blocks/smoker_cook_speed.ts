// Smoker + blast furnace. Smoker cooks food 2x faster than normal
// furnace. Blast furnace cooks ores 2x faster but can only smelt
// metals/ores.

export type FurnaceKind = 'furnace' | 'smoker' | 'blast_furnace';

export const NORMAL_SMELT_TICKS = 200;
export const FAST_SMELT_TICKS = 100;

export interface SmeltQuery {
  kind: FurnaceKind;
  inputId: string;
}

export function smeltTicksFor(q: SmeltQuery): number {
  return q.kind === 'furnace' ? NORMAL_SMELT_TICKS : FAST_SMELT_TICKS;
}

const SMOKER_ALLOWED = new Set<string>([
  'webmc:beef',
  'webmc:porkchop',
  'webmc:chicken',
  'webmc:cod',
  'webmc:salmon',
  'webmc:mutton',
  'webmc:rabbit',
  'webmc:potato',
  'webmc:kelp',
]);

const BLAST_ALLOWED = new Set<string>([
  'webmc:iron_ore',
  'webmc:gold_ore',
  'webmc:copper_ore',
  'webmc:deepslate_iron_ore',
  'webmc:deepslate_gold_ore',
  'webmc:deepslate_copper_ore',
  'webmc:ancient_debris',
  'webmc:raw_iron',
  'webmc:raw_gold',
  'webmc:raw_copper',
  'webmc:iron_ingot',
  'webmc:gold_ingot',
  'webmc:chain',
]);

export function canSmeltIn(q: SmeltQuery): boolean {
  if (q.kind === 'furnace') return true;
  if (q.kind === 'smoker') return SMOKER_ALLOWED.has(q.inputId);
  return BLAST_ALLOWED.has(q.inputId);
}
