// Pale garden (1.21.4). Muted-palette biome: pale oak trees, pale moss
// carpet, pale moss blocks, hanging moss, creaking hearts. No passive
// mobs except the creaking at night.

export interface PaleGardenFeatures {
  paleOakCount: number;
  creakingHeartCount: number;
  mossCarpetCoverage: number;
  hangingMossPatches: number;
  eyeblossomCount: number;
}

export interface PaleGardenQuery {
  rng: () => number;
  areaBlocks: number;
}

export function planPaleGarden(q: PaleGardenQuery): PaleGardenFeatures {
  const scale = q.areaBlocks / 1000;
  return {
    paleOakCount: Math.floor(3 + scale * 2),
    creakingHeartCount: Math.floor(scale * 0.3),
    mossCarpetCoverage: 0.3 + q.rng() * 0.2,
    hangingMossPatches: Math.floor(scale * 0.8),
    eyeblossomCount: Math.floor(scale * 0.4 * q.rng()),
  };
}

// Eyeblossom flowers: open in day, closed at night; closed blossoms emit
// a dim particle and give nausea to nearby players.
export interface EyeblossomState {
  open: boolean;
}

export function tickEyeblossom(
  state: EyeblossomState,
  isDay: boolean,
): 'opened' | 'closed' | 'none' {
  if (isDay && !state.open) {
    state.open = true;
    return 'opened';
  }
  if (!isDay && state.open) {
    state.open = false;
    return 'closed';
  }
  return 'none';
}

// Closed eyeblossom applies nausea to players in 5-block radius.
export const EYEBLOSSOM_NAUSEA_RADIUS = 5;
export const EYEBLOSSOM_NAUSEA_DURATION_SEC = 7;

export function playersToApplyNausea(
  flowerPos: { x: number; y: number; z: number },
  players: readonly { id: string; pos: { x: number; y: number; z: number } }[],
): string[] {
  const out: string[] = [];
  for (const p of players) {
    const dx = p.pos.x - flowerPos.x;
    const dy = p.pos.y - flowerPos.y;
    const dz = p.pos.z - flowerPos.z;
    if (Math.hypot(dx, dy, dz) <= EYEBLOSSOM_NAUSEA_RADIUS) out.push(p.id);
  }
  return out;
}
