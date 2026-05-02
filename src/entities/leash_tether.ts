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

// Shared mutable result. Caller iterates leashed mobs each frame and
// reads broken/pullVec.x/y/z synchronously before the next call, so
// reusing one object cuts a fresh result + nested pullVec literal per
// leashed mob per frame.
const SHARED_RESULT: LeashResult = {
  broken: false,
  pullVec: { x: 0, y: 0, z: 0 },
};

export function tensionStep(c: LeashCtx): LeashResult {
  const dx = c.anchorPos.x - c.mobPos.x;
  const dy = c.anchorPos.y - c.mobPos.y;
  const dz = c.anchorPos.z - c.mobPos.z;
  const dist = Math.hypot(dx, dy, dz);
  const out = SHARED_RESULT;
  out.pullVec.x = 0;
  out.pullVec.y = 0;
  out.pullVec.z = 0;
  if (dist > LEASH_BREAK) {
    out.broken = true;
    return out;
  }
  out.broken = false;
  if (dist <= LEASH_MAX_PULL) return out;
  const scale = (dist - LEASH_MAX_PULL) / dist;
  out.pullVec.x = dx * scale * 0.1;
  out.pullVec.y = dy * scale * 0.1;
  out.pullVec.z = dz * scale * 0.1;
  return out;
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
