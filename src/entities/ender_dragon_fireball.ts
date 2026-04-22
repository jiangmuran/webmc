// Ender Dragon fireball breath attack. A lingering purple area-effect
// cloud deals poison-like damage every ~1s, lasts ~20s.

export interface DragonBreath {
  posX: number;
  posY: number;
  posZ: number;
  radius: number;
  ageTicks: number;
  maxAgeTicks: number;
}

export const DEFAULT_RADIUS = 4;
export const MAX_AGE_TICKS = 400; // 20s
export const DMG_INTERVAL_TICKS = 20;
export const DMG_PER_TICK = 6;

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
