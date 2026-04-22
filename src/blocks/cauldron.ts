// Cauldron (water / lava / powder snow). Stores up to 3 levels of a
// fluid; used to wash dyed items, fill bottles, extinguish fire, dye
// armor / leather / banners.

export type CauldronContent = 'empty' | 'water' | 'lava' | 'powder_snow';

export interface CauldronState {
  content: CauldronContent;
  level: number; // 0..3
}

const MAX_LEVEL = 3;

export function makeCauldron(): CauldronState {
  return { content: 'empty', level: 0 };
}

export function fillCauldron(state: CauldronState, content: CauldronContent): boolean {
  if (state.content !== 'empty' && state.content !== content) return false;
  if (state.level >= MAX_LEVEL) return false;
  state.content = content;
  state.level = MAX_LEVEL; // bucket fills all 3 levels at once
  return true;
}

export function addBottle(state: CauldronState): boolean {
  if (state.content !== 'water') return false;
  if (state.level >= MAX_LEVEL) return false;
  state.level++;
  return true;
}

export function takeBottle(state: CauldronState): boolean {
  if (state.content !== 'water' || state.level <= 0) return false;
  state.level--;
  if (state.level === 0) state.content = 'empty';
  return true;
}

export function emptyCauldron(state: CauldronState): void {
  state.content = 'empty';
  state.level = 0;
}

export interface WashItem {
  name: string;
  isDyed: boolean;
  isBanner: boolean;
  isShulkerBox: boolean;
}

// Water cauldron washes dyed armor / leather / banner / shulker box. Each
// wash consumes 1 level.
export function washItem(state: CauldronState, item: WashItem): boolean {
  if (state.content !== 'water' || state.level <= 0) return false;
  if (!item.isDyed && !item.isBanner && !item.isShulkerBox) return false;
  state.level--;
  if (state.level === 0) state.content = 'empty';
  return true;
}

// Comparator signal = level (matches MC).
export function comparatorSignal(state: CauldronState): number {
  return state.level;
}
