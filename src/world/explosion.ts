// Explosion damage model — spherical blast with distance falloff, world-
// block destruction, and entity damage. Pure function: given a center,
// power, and queries against world/entity state, return what blocks to
// clear + what entities to damage.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface ExplosionLookup {
  // Blast resistance (MC's per-block constant; higher = harder to break).
  resistance(x: number, y: number, z: number): number;
  // Whether a block exists at all (air = false).
  exists(x: number, y: number, z: number): boolean;
}

export interface EntityQuery {
  readonly id: number;
  readonly position: Vec3;
  readonly radius: number; // AABB circumradius (for distance check)
}

export interface ExplosionResult {
  destroyedBlocks: readonly Vec3[];
  damagedEntities: readonly { id: number; damage: number }[];
}

// MC's "ray-trace from center to sphere surface, deplete strength by block
// resistance" algorithm, simplified to a uniform sphere and an integer
// lattice traversal. Power 4 (creeper) destroys most blocks within ~3m;
// power 8 (charged creeper) within ~5m.
const RAY_STEP = 0.3;
const RAY_RESOLUTION = 16;

export function computeExplosion(
  center: Vec3,
  power: number,
  lookup: ExplosionLookup,
  entities: readonly EntityQuery[] = [],
): ExplosionResult {
  const destroyed = new Set<string>();
  const radius = power * 2; // MC: effective radius ≈ 2 × power
  const key = (x: number, y: number, z: number): string =>
    `${Math.floor(x).toString()},${Math.floor(y).toString()},${Math.floor(z).toString()}`;

  // Cast rays from center in a low-res sphere of directions.
  for (let a = 0; a < RAY_RESOLUTION; a++) {
    for (let b = 0; b < RAY_RESOLUTION; b++) {
      const theta = (a / RAY_RESOLUTION) * Math.PI * 2;
      const phi = (b / RAY_RESOLUTION) * Math.PI - Math.PI / 2;
      const dx = Math.cos(phi) * Math.cos(theta);
      const dy = Math.sin(phi);
      const dz = Math.cos(phi) * Math.sin(theta);
      let strength = power * (0.7 + Math.random() * 0.6);
      let cx = center.x;
      let cy = center.y;
      let cz = center.z;
      while (strength > 0) {
        const bx = Math.floor(cx);
        const by = Math.floor(cy);
        const bz = Math.floor(cz);
        if (lookup.exists(bx, by, bz)) {
          const res = lookup.resistance(bx, by, bz);
          strength -= (res + 0.3) * RAY_STEP;
          if (strength > 0) destroyed.add(key(bx, by, bz));
        }
        strength -= 0.225 * RAY_STEP; // air attenuation
        cx += dx * RAY_STEP;
        cy += dy * RAY_STEP;
        cz += dz * RAY_STEP;
      }
    }
  }

  const destroyedBlocks: Vec3[] = [];
  for (const k of destroyed) {
    const [x, y, z] = k.split(',').map(Number);
    destroyedBlocks.push({ x: x ?? 0, y: y ?? 0, z: z ?? 0 });
  }

  // Entity damage: distance-inverse scaled by power.
  const damagedEntities: { id: number; damage: number }[] = [];
  for (const e of entities) {
    const dx = e.position.x - center.x;
    const dy = e.position.y - center.y;
    const dz = e.position.z - center.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist >= radius) continue;
    const impact = (1 - dist / radius) * power * 3.5;
    const dmg = Math.floor(impact + 0.5);
    if (dmg > 0) damagedEntities.push({ id: e.id, damage: dmg });
  }
  return { destroyedBlocks, damagedEntities };
}
