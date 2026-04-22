// Trail ruins (1.20 archaeology). Buried ancient villages. Each ruin is
// a sprawl of mud-brick + packed-mud foundations dotted with suspicious
// gravel the player can brush for sherds, armor trims, and relic music
// discs.

export type TrailRuinBuilding = 'one_room_house' | 'hut_tower' | 'large_house' | 'pathway';

export interface TrailRuinLayout {
  buildings: readonly TrailRuinBuilding[];
  suspiciousGravelCount: number;
  sherdPoolCount: number;
  relicDiscChance: number;
}

export interface TrailRuinQuery {
  rng: () => number;
  depth: number; // how buried (1-8, 1=shallow)
}

export function planTrailRuin(q: TrailRuinQuery): TrailRuinLayout {
  const buildings: TrailRuinBuilding[] = ['one_room_house'];
  const extra = 2 + Math.floor(q.rng() * 4);
  for (let i = 0; i < extra; i++) {
    const kinds: TrailRuinBuilding[] = ['one_room_house', 'hut_tower', 'large_house', 'pathway'];
    const pick = kinds[Math.floor(q.rng() * kinds.length)];
    if (pick) buildings.push(pick);
  }
  const suspiciousCount = Math.floor(10 + q.rng() * 20);
  return {
    buildings,
    suspiciousGravelCount: suspiciousCount,
    sherdPoolCount: Math.floor(suspiciousCount * 0.6),
    relicDiscChance: 0.02,
  };
}

// Deterministic sherd/relic pull from the combined common+rare brush pool.
export type TrailLoot =
  | { kind: 'sherd'; id: string }
  | { kind: 'trim'; id: string }
  | { kind: 'disc'; id: 'relic' }
  | { kind: 'common'; item: string; count: number };

export function drawTrailLoot(roll: number, rareRoll: number): TrailLoot {
  if (rareRoll < 0.02) return { kind: 'disc', id: 'relic' };
  if (rareRoll < 0.08) {
    const trims = ['webmc:flow_armor_trim', 'webmc:bolt_armor_trim', 'webmc:host_armor_trim'];
    const pick = trims[Math.min(trims.length - 1, Math.floor(rareRoll * 100) % trims.length)];
    return { kind: 'trim', id: pick ?? 'webmc:flow_armor_trim' };
  }
  if (roll < 0.4) {
    const sherds = [
      'angler',
      'archer',
      'arms_up',
      'blade',
      'brewer',
      'burn',
      'danger',
      'explorer',
      'flow',
      'friend',
    ];
    const pick = sherds[Math.floor(roll * 10) % sherds.length];
    return { kind: 'sherd', id: `webmc:${pick ?? 'angler'}_pottery_sherd` };
  }
  const commons = ['webmc:wheat', 'webmc:coal', 'webmc:iron_nugget', 'webmc:emerald'];
  const pick = commons[Math.floor(roll * 4) % commons.length];
  return { kind: 'common', item: pick ?? 'webmc:wheat', count: 1 };
}
