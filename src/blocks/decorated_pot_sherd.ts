// Decorated pot. Crafted from 4 pottery sherds or bricks (one per
// face). Breaking drops sherds/bricks instead of the pot item.

export type PotFace = 'north' | 'south' | 'east' | 'west';
export type SherdOrBrick = { kind: 'sherd'; pattern: string } | { kind: 'brick' };

export interface DecoratedPot {
  faces: Record<PotFace, SherdOrBrick>;
}

export const ALL_SHERDS = [
  'archer',
  'arms_up',
  'blade',
  'brewer',
  'burn',
  'danger',
  'explorer',
  'friend',
  'heart',
  'heartbreak',
  'howl',
  'miner',
  'mourner',
  'plenty',
  'prize',
  'sheaf',
  'shelter',
  'skull',
  'snort',
];

export function isValidSherd(pattern: string): boolean {
  return ALL_SHERDS.includes(pattern);
}

export function craftPot(
  front: SherdOrBrick,
  back: SherdOrBrick,
  left: SherdOrBrick,
  right: SherdOrBrick,
): DecoratedPot | null {
  if (front.kind === 'sherd' && !isValidSherd(front.pattern)) return null;
  if (back.kind === 'sherd' && !isValidSherd(back.pattern)) return null;
  if (left.kind === 'sherd' && !isValidSherd(left.pattern)) return null;
  if (right.kind === 'sherd' && !isValidSherd(right.pattern)) return null;
  return { faces: { north: front, south: back, east: right, west: left } };
}

// Breaking drops: each face drops its sherd/brick. 1x brick = 1 brick.
export function breakDrops(p: DecoratedPot): { id: string; count: number }[] {
  const out: { id: string; count: number }[] = [];
  for (const f of Object.values(p.faces)) {
    if (f.kind === 'brick') out.push({ id: 'webmc:brick', count: 1 });
    else out.push({ id: `webmc:pottery_sherd_${f.pattern}`, count: 1 });
  }
  return out;
}
