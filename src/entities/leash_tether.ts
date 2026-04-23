// Leash tether. Max 10 blocks; beyond that mob is pulled toward anchor,
// beyond 15 it breaks.

export const LEASH_MAX_PULL = 10;
export const LEASH_BREAK = 15;

export interface LeashCtx {
  anchorPos: { x: number; y: number; z: number };
  mobPos: { x: number; y: number; z: number };
}

export interface LeashResult {
  broken: boolean;
  pullVec: { x: number; y: number; z: number };
}

export function tensionStep(c: LeashCtx): LeashResult {
  const dx = c.anchorPos.x - c.mobPos.x;
  const dy = c.anchorPos.y - c.mobPos.y;
  const dz = c.anchorPos.z - c.mobPos.z;
  const dist = Math.hypot(dx, dy, dz);
  if (dist > LEASH_BREAK) return { broken: true, pullVec: { x: 0, y: 0, z: 0 } };
  if (dist <= LEASH_MAX_PULL) return { broken: false, pullVec: { x: 0, y: 0, z: 0 } };
  const scale = (dist - LEASH_MAX_PULL) / dist;
  return {
    broken: false,
    pullVec: { x: dx * scale * 0.1, y: dy * scale * 0.1, z: dz * scale * 0.1 },
  };
}

// Ordinarily leashes are only valid for small/tame mobs.
const LEASHABLE = new Set([
  'pig',
  'cow',
  'sheep',
  'chicken',
  'horse',
  'donkey',
  'mule',
  'wolf',
  'cat',
  'ocelot',
  'llama',
  'mooshroom',
  'dolphin',
  'allay',
  'fox',
  'rabbit',
  'strider',
  'axolotl',
  'frog',
  'goat',
]);

export function canLeash(mobType: string): boolean {
  return LEASHABLE.has(mobType);
}
