// Nether sprouts / crimson/warped roots. Generated atop crimson_nylium
// and warped_nylium, respectively. Bone meal boosts density.

export type NyliumKind = 'crimson' | 'warped';

export interface SproutBlock {
  kind: NyliumKind;
  variant: 'sprouts' | 'roots' | 'fungus' | 'vines';
}

export const BONE_MEAL_CLUMP_RADIUS = 4;

export interface BoneMealQuery {
  surfaceKind: NyliumKind;
  rand: () => number;
}

export function boneMealClump(q: BoneMealQuery): SproutBlock[] {
  const out: SproutBlock[] = [];
  const count = 4 + Math.floor(q.rand() * 8);
  for (let i = 0; i < count; i++) {
    const r = q.rand();
    let variant: SproutBlock['variant'];
    if (r < 0.4) variant = 'sprouts';
    else if (r < 0.75) variant = 'roots';
    else if (r < 0.9) variant = 'fungus';
    else variant = 'vines';
    out.push({ kind: q.surfaceKind, variant });
  }
  return out;
}

// Large fungus (bone-meal on fungus) takes a big 3D region.
export function largeFungusFootprint(kind: NyliumKind): { radius: number; height: number } {
  return kind === 'crimson' ? { radius: 3, height: 10 } : { radius: 4, height: 13 };
}
