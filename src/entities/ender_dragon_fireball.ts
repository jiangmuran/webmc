// Ender Dragon fireball breath attack. A lingering purple area-effect
// cloud deposited by a dragon fireball follows the standard
// lingering-potion cloud lifetime.
//
// Wiki (minecraft.wiki/w/Lingering_Potion): "The cloud starts with
// a radius of 3 blocks, decreasing to 0 over the course of 30
// seconds." 30 s × 20 t/s = 600 ticks. Old MAX_AGE_TICKS = 400
// (20 s) was 33% under the wiki cloud lifetime — JE dragon
// fireball clouds last the full 30 s before fading.
//
// Wiki (minecraft.wiki/w/Ender_Dragon): the dragon's breath cloud
// damages "similarly to a lingering potion of Harming II" — 6 HP
// per second tick.

export interface DragonBreath {
  posX: number;
  posY: number;
  posZ: number;
  radius: number;
  ageTicks: number;
  maxAgeTicks: number;
}

export const DEFAULT_RADIUS = 4;
export const MAX_AGE_TICKS = 600; // 30 s — wiki lingering-cloud lifetime
export const DMG_INTERVAL_TICKS = 20; // damage applied every 1 s
export const DMG_PER_TICK = 6; // 6 HP per damage tick (= 6 HP/s)

export function makeBreath(x: number, y: number, z: number): DragonBreath {
  return {
    posX: x,
    posY: y,
    posZ: z,
    radius: DEFAULT_RADIUS,
    ageTicks: 0,
    maxAgeTicks: MAX_AGE_TICKS,
  };
}

export function tickBreath(b: DragonBreath): { expired: boolean } {
  b.ageTicks += 1;
  return { expired: b.ageTicks >= b.maxAgeTicks };
}

export function damageThisTick(
  b: DragonBreath,
  entity: { x: number; y: number; z: number },
): number {
  if (b.ageTicks % DMG_INTERVAL_TICKS !== 0) return 0;
  const dx = entity.x - b.posX;
  const dy = entity.y - b.posY;
  const dz = entity.z - b.posZ;
  if (dx * dx + dy * dy + dz * dz > b.radius * b.radius) return 0;
  return DMG_PER_TICK;
}

// Dragon's breath collected in a glass bottle creates lingering potions.
export interface BottleCollectQuery {
  playerHoldsEmptyBottle: boolean;
  playerInsideBreath: boolean;
}

export function collectBreath(q: BottleCollectQuery): 'webmc:dragon_breath' | null {
  if (!q.playerHoldsEmptyBottle) return null;
  if (!q.playerInsideBreath) return null;
  return 'webmc:dragon_breath';
}
