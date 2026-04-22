// Nylium (crimson/warped). Bone meal on nylium covers adjacent netherrack
// with additional nylium + grows crimson/warped roots, shroomlight, and
// fungi nearby. Hoeing turns nylium back into netherrack.

export type NyliumKind = 'crimson' | 'warped';

export interface BoneMealQuery {
  nyliumKind: NyliumKind;
  anchor: { x: number; y: number; z: number };
  neighbors: readonly { x: number; y: number; z: number; block: string }[];
  rng: () => number;
}

export interface PlacementEvent {
  pos: { x: number; y: number; z: number };
  block: string;
}

// Returns placement events: up to 20 adjacent netherrack positions get
// nylium, and some get extra decorations.
export function boneMealNylium(q: BoneMealQuery): PlacementEvent[] {
  const out: PlacementEvent[] = [];
  const nyliumId = `webmc:${q.nyliumKind}_nylium`;
  for (const n of q.neighbors) {
    if (n.block !== 'webmc:netherrack') continue;
    if (q.rng() < 0.5) {
      out.push({ pos: { x: n.x, y: n.y, z: n.z }, block: nyliumId });
    }
  }

  // Decorations on top of placed nylium — one of: roots, shroomlight,
  // fungus variants, depending on kind.
  for (const placed of out.slice()) {
    if (q.rng() < 0.3) {
      const decoration = pickDecoration(q.nyliumKind, q.rng());
      out.push({
        pos: { x: placed.pos.x, y: placed.pos.y + 1, z: placed.pos.z },
        block: decoration,
      });
    }
  }
  return out;
}

function pickDecoration(kind: NyliumKind, roll: number): string {
  const pool =
    kind === 'crimson'
      ? ['webmc:crimson_roots', 'webmc:crimson_fungus', 'webmc:shroomlight']
      : ['webmc:warped_roots', 'webmc:warped_fungus', 'webmc:shroomlight'];
  const idx = Math.min(pool.length - 1, Math.floor(roll * pool.length));
  return pool[idx] ?? pool[0] ?? 'webmc:netherrack';
}

// Hoe a nylium → netherrack + drop nothing.
export function hoeNylium(kind: NyliumKind): {
  newBlock: 'webmc:netherrack';
  drops: readonly string[];
} {
  void kind;
  return { newBlock: 'webmc:netherrack', drops: [] };
}
