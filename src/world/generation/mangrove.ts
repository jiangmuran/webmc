// Mangrove tree (1.19). Grows from a propagule planted on mud, grass, or
// dirt; produces aerial roots that grow through water. The tree has
// a tall trunk with branching "prop roots" forming a ~7-9 block wide base.

export interface MangroveTreeLayout {
  trunkHeight: number;
  rootBallRadius: number;
  propagulesAtCrown: number;
  mossCarpetCoverage: number;
}

export interface MangroveQuery {
  rng: () => number;
  inSwamp: boolean;
}

export function planMangrove(q: MangroveQuery): MangroveTreeLayout {
  const trunkHeight = 8 + Math.floor(q.rng() * 6); // 8..13
  const rootBallRadius = q.inSwamp ? 3 + Math.floor(q.rng() * 2) : 2;
  return {
    trunkHeight,
    rootBallRadius,
    propagulesAtCrown: 2 + Math.floor(q.rng() * 4),
    mossCarpetCoverage: q.inSwamp ? 0.6 : 0.1,
  };
}

// Propagule growth: age 0..4; at 4 it drops onto the ground and grows
// into a sapling-ready propagule.
export interface PropaguleState {
  age: 0 | 1 | 2 | 3 | 4;
  hanging: boolean;
}

export function tickPropagule(state: PropaguleState, roll: number): boolean {
  if (state.age === 4) return false;
  if (roll >= 1 / 7) return false;
  state.age = (state.age + 1) as 0 | 1 | 2 | 3 | 4;
  return true;
}

// Aerial root placement: when a mangrove tree grows over water, aerial
// roots stretch down through the water up to `rootReach` blocks.
export const MAX_ROOT_REACH = 8;

export function aerialRootPositions(
  trunkBase: { x: number; y: number; z: number },
  waterDepth: number,
): { x: number; y: number; z: number }[] {
  const reach = Math.min(MAX_ROOT_REACH, waterDepth);
  const out: { x: number; y: number; z: number }[] = [];
  for (let dy = 0; dy < reach; dy++) {
    out.push({ x: trunkBase.x, y: trunkBase.y - dy, z: trunkBase.z });
  }
  return out;
}

// Muddy mangrove root can be converted to packed mud + water pack.
export function breakMuddyRoot(silkTouch: boolean): { item: string; count: number }[] {
  if (silkTouch) return [{ item: 'webmc:muddy_mangrove_roots', count: 1 }];
  return [{ item: 'webmc:mangrove_roots', count: 1 }];
}
