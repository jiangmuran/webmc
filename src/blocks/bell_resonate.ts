// Village bell. When rung, highlights hostile raid-participants in a
// 32-block radius via glowing effect for 3s. Also alerts nearby
// villagers to seek shelter.

export interface BellRing {
  ringPos: { x: number; y: number; z: number };
  nowMs: number;
}

export const GLOW_RADIUS = 32;
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
  const hit: string[] = [];
  for (const m of mobs) {
    if (!RAID_MOB_TYPES.has(m.mobType)) continue;
    const dx = m.pos.x - r.ringPos.x;
    const dy = m.pos.y - r.ringPos.y;
    const dz = m.pos.z - r.ringPos.z;
    if (dx * dx + dy * dy + dz * dz <= GLOW_RADIUS * GLOW_RADIUS) hit.push(m.id);
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
