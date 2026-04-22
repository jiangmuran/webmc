// Hoe tilling. Right-click on dirt/coarse dirt/rooted dirt/path →
// farmland (or plain dirt for rooted/path). Costs 1 durability.

export type TilledBlock = 'farmland' | 'dirt';

const TILL_MAP: Record<string, TilledBlock> = {
  'webmc:dirt': 'farmland',
  'webmc:grass_block': 'farmland',
  'webmc:dirt_path': 'dirt',
  'webmc:coarse_dirt': 'dirt',
  'webmc:rooted_dirt': 'dirt',
};

export interface HoeQuery {
  targetBlockName: string;
  airAbove: boolean;
}

export interface HoeResult {
  tilled: TilledBlock | null;
  durabilityCost: number;
}

export function useHoe(q: HoeQuery): HoeResult {
  if (!q.airAbove) return { tilled: null, durabilityCost: 0 };
  const out = TILL_MAP[q.targetBlockName];
  if (!out) return { tilled: null, durabilityCost: 0 };
  return { tilled: out, durabilityCost: 1 };
}
