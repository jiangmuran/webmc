// Chain block. Decorative + structurally support-bearing: hanging
// lanterns can attach to a chain below. Axis: x / y / z depending on
// placement face.

export type ChainAxis = 'x' | 'y' | 'z';

export interface ChainBlock {
  axis: ChainAxis;
  waterlogged: boolean;
}

export function placeChain(face: 'top' | 'bottom' | 'side_x' | 'side_z'): ChainBlock {
  const axis: ChainAxis = face === 'top' || face === 'bottom' ? 'y' : face === 'side_x' ? 'x' : 'z';
  return { axis, waterlogged: false };
}

export function rotateAxis(ax: ChainAxis): ChainAxis {
  // Rotations around vertical cycle x→z→x; y stays.
  if (ax === 'y') return 'y';
  return ax === 'x' ? 'z' : 'x';
}

// A lantern "hangs" from a chain if the chain is directly above it AND
// axis is y. Chains along x/z axes don't support hanging lanterns.
export function canSupportHangingLantern(chain: ChainBlock): boolean {
  return chain.axis === 'y';
}

// Chain breaking: silk-touch-or-not, always drops a chain item.
export function chainDrops(): { item: 'webmc:chain'; count: 1 }[] {
  return [{ item: 'webmc:chain', count: 1 }];
}

// Chain crafting: 2 iron nuggets + 1 iron ingot (vertical: nugget / ingot
// / nugget) = 1 chain.
export interface CraftChainQuery {
  ironNuggets: number;
  ironIngots: number;
}

export function craftChain(q: CraftChainQuery): { item: 'webmc:chain'; count: 1 } | null {
  if (q.ironNuggets < 2 || q.ironIngots < 1) return null;
  return { item: 'webmc:chain', count: 1 };
}
