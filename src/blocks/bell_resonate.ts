// Village bell. When rung, highlights hostile raid-participants via
// glowing effect for 3s.
//
// Wiki (minecraft.wiki/w/Bell#Glowing_effect): "If a bell is rung
// and there is a raid mob within a 32 block spherical range, the
// Glowing effect is applied to all raid mobs within 48 blocks for
// 3 seconds." Two distinct radii — old code used a single 32-block
// radius for both trigger and apply, missing raid mobs in the
// 32–48 shell that should glow once the bell is triggered.
// Sibling fix lives in bell_ring_damage_raiders.ts.

export interface BellRing {
  ringPos: { x: number; y: number; z: number };
  nowMs: number;
}

export const TRIGGER_RADIUS = 32;
export const GLOW_RADIUS = 48;
export const GLOW_DURATION_MS = 3000;

export interface RaidMob {
  id: string;
  pos: { x: number; y: number; z: number };
  mobType: string;
}

const RAID_MOB_TYPES = new Set<string>([
  'pillager',
  'vindicator',
  'evoker',
  'witch',
  'ravager',
  'illusioner',
]);

export function highlightTargets(r: BellRing, mobs: RaidMob[]): string[] {
  const sqDist = (m: RaidMob): number => {
    const dx = m.pos.x - r.ringPos.x;
    const dy = m.pos.y - r.ringPos.y;
    const dz = m.pos.z - r.ringPos.z;
    return dx * dx + dy * dy + dz * dz;
  };
  const triggered = mobs.some(
    (m) => RAID_MOB_TYPES.has(m.mobType) && sqDist(m) <= TRIGGER_RADIUS * TRIGGER_RADIUS,
  );
  if (!triggered) return [];
  const hit: string[] = [];
  for (const m of mobs) {
    if (!RAID_MOB_TYPES.has(m.mobType)) continue;
    if (sqDist(m) <= GLOW_RADIUS * GLOW_RADIUS) hit.push(m.id);
  }
  return hit;
}

export function glowExpiresAt(ringNowMs: number): number {
  return ringNowMs + GLOW_DURATION_MS;
}

// Villagers take shelter when bell rings during a raid.
export function villagersFleeing(anyRaidMobsNearby: boolean, raidActive: boolean): boolean {
  return raidActive && anyRaidMobsNearby;
}
