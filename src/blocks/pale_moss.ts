// Pale moss block + carpet + hanging moss. Bone-meal on pale moss
// block converts nearby stone/deepslate/dirt into mossy variants within
// a 3-block radius, just like regular moss.

export type MossTarget = 'stone' | 'deepslate' | 'dirt' | 'gravel';

export function convertedName(target: MossTarget): string | null {
  switch (target) {
    case 'stone':
      return 'webmc:pale_moss_block';
    case 'deepslate':
      return 'webmc:pale_moss_block';
    case 'dirt':
      return 'webmc:pale_moss_block';
    case 'gravel':
      return null;
  }
}

export interface MossLookup {
  topNonAir: (x: number, z: number) => { y: number; block: string } | null;
}

export interface BoneMealQuery {
  at: { x: number; y: number; z: number };
  lookup: MossLookup;
  radius?: number;
}

export interface MossSpreadEvent {
  pos: { x: number; y: number; z: number };
  to: string;
}

const DEFAULT_RADIUS = 3;

const CONVERTIBLE = new Set<string>([
  'webmc:stone',
  'webmc:cobblestone',
  'webmc:deepslate',
  'webmc:cobbled_deepslate',
  'webmc:dirt',
  'webmc:grass_block',
]);

export function boneMealPaleMoss(q: BoneMealQuery): MossSpreadEvent[] {
  const radius = q.radius ?? DEFAULT_RADIUS;
  const out: MossSpreadEvent[] = [];
  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const col = q.lookup.topNonAir(q.at.x + dx, q.at.z + dz);
      if (!col) continue;
      if (!CONVERTIBLE.has(col.block)) continue;
      out.push({
        pos: { x: q.at.x + dx, y: col.y, z: q.at.z + dz },
        to: 'webmc:pale_moss_block',
      });
    }
  }
  return out;
}

// Carpet variant: 1-pixel tall, emits no light, walks-through like grass.
// Breaking always drops 1 pale_moss_carpet (no fortune bonus).
export function paleMossCarpetDrops(): { item: 'webmc:pale_moss_carpet'; count: 1 }[] {
  return [{ item: 'webmc:pale_moss_carpet', count: 1 }];
}

// Hanging moss: grows downward from the underside of a block up to 8
// blocks; the lowest block can be broken by hand without dropping items.
export const HANGING_MOSS_MAX_LENGTH = 8;

export function hangingMossDrops(byShears: boolean): { item: string; count: number }[] {
  if (byShears) return [{ item: 'webmc:hanging_moss', count: 1 }];
  return [];
}
