// Arrow flight. Fired from a bow with a draw fraction (0..1); velocity
// is 3 * draw. Drag 0.99 per tick, gravity 0.05. Power enchant adds
// 25% per level on damage (not velocity).

export interface Arrow {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  inGround: boolean;
  critical: boolean;
}

export const GRAVITY = 0.05;
export const DRAG = 0.99;

export function fireArrow(
  origin: { x: number; y: number; z: number },
  direction: { x: number; y: number; z: number },
  draw: number,
): Arrow {
  const speed = 3 * draw;
  const len = Math.sqrt(direction.x ** 2 + direction.y ** 2 + direction.z ** 2) || 1;
  return {
    x: origin.x,
    y: origin.y,
    z: origin.z,
    vx: (direction.x / len) * speed,
    vy: (direction.y / len) * speed,
    vz: (direction.z / len) * speed,
    inGround: false,
    critical: draw >= 1,
  };
}

export function tickArrow(a: Arrow): void {
  if (a.inGround) return;
  a.x += a.vx;
  a.y += a.vy;
  a.z += a.vz;
  a.vx *= DRAG;
  a.vy *= DRAG;
  a.vz *= DRAG;
  a.vy -= GRAVITY;
}

export function speed(a: Arrow): number {
  return Math.sqrt(a.vx * a.vx + a.vy * a.vy + a.vz * a.vz);
}

export function damageFor(a: Arrow, powerEnchantLevel: number): number {
  const base = Math.ceil(speed(a) * 2);
  // Wiki (minecraft.wiki/w/Power): bonus = base * 0.25 * (level + 1).
  // Old formula used 0.25 * level (off by one level), under-shooting
  // bonus damage at every Power level (e.g. Power V gave +1.25 base
  // instead of the wiki's +1.5).
  const powered =
    base + (powerEnchantLevel > 0 ? Math.floor(base * 0.25 * (powerEnchantLevel + 1) + 0.5) : 0);
  return a.critical ? powered + 1 + Math.floor(Math.random() * Math.ceil(powered / 2)) : powered;
}
