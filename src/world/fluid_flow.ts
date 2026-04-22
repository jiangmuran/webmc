// Fluid flow propagation. Water spreads 7 blocks horizontally, lava 3
// (overworld) or 7 (nether). Each tick a source block tries to flow
// downward first, then sideways; the "level" field 0..7 tracks how far
// the flow is from its source.

export type FluidKind = 'water' | 'lava';
export type FluidDimension = 'overworld' | 'nether' | 'end';

export interface FluidState {
  kind: FluidKind;
  level: number; // 0 = source, 1..7 = flowing
  falling: boolean;
}

export function maxFlowDistance(kind: FluidKind, dim: FluidDimension): number {
  if (kind === 'water') return 7;
  return dim === 'nether' ? 7 : 3;
}

export interface FlowLookup {
  get: (x: number, y: number, z: number) => FluidState | null;
  isSolid: (x: number, y: number, z: number) => boolean;
  isReplaceable: (x: number, y: number, z: number) => boolean;
}

export interface FluidTickCtx {
  pos: { x: number; y: number; z: number };
  state: FluidState;
  lookup: FlowLookup;
  dimension: FluidDimension;
}

export interface FluidFlowEvent {
  pos: { x: number; y: number; z: number };
  next: FluidState;
}

// Compute which neighbors this fluid block should flow into this tick.
// Deterministic: down first, then 4 horizontal in fixed order.
export function computeFlow(ctx: FluidTickCtx): FluidFlowEvent[] {
  const out: FluidFlowEvent[] = [];
  const { pos, state, lookup, dimension } = ctx;
  const maxDist = maxFlowDistance(state.kind, dimension);
  // Downward flow first.
  const below = { x: pos.x, y: pos.y - 1, z: pos.z };
  if (lookup.isReplaceable(below.x, below.y, below.z)) {
    out.push({
      pos: below,
      next: { kind: state.kind, level: 0, falling: true },
    });
    return out; // while falling, horizontal flow pauses
  }
  // Horizontal flow only if we still have "budget".
  if (state.level >= maxDist) return out;
  const nextLevel = state.level + 1;
  const neighbors: { x: number; y: number; z: number }[] = [
    { x: pos.x + 1, y: pos.y, z: pos.z },
    { x: pos.x - 1, y: pos.y, z: pos.z },
    { x: pos.x, y: pos.y, z: pos.z + 1 },
    { x: pos.x, y: pos.y, z: pos.z - 1 },
  ];
  for (const n of neighbors) {
    if (!lookup.isReplaceable(n.x, n.y, n.z)) continue;
    const existing = lookup.get(n.x, n.y, n.z);
    if (existing?.kind === state.kind && existing.level <= nextLevel) continue;
    out.push({
      pos: n,
      next: { kind: state.kind, level: nextLevel, falling: false },
    });
  }
  return out;
}

// Water + lava adjacency → obsidian / cobblestone / stone reactions.
export function fluidReaction(a: FluidKind, b: FluidKind, aIsSource: boolean): string | null {
  if (a === b) return null;
  if (a === 'water' && b === 'lava') {
    return aIsSource ? 'webmc:obsidian' : 'webmc:cobblestone';
  }
  if (a === 'lava' && b === 'water') {
    return aIsSource ? 'webmc:obsidian' : 'webmc:cobblestone';
  }
  return null;
}
