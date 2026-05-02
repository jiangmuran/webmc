// XP orb: a tiny collectible entity that floats toward the nearest player
// within pickup radius and adds its XP value on collection. Matches MC: orbs
// cluster toward the player and auto-collect; larger drops split into
// multiple orbs to avoid stacking overflow.

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface XpOrb {
  readonly id: number;
  readonly value: number;
  position: Vec3;
  velocity: Vec3;
  ageSec: number;
}

const DESPAWN_SEC = 300;
// Wiki (minecraft.wiki/w/Experience): "Experience orbs ... float or
// glide toward the player up to a distance of 7.25 blocks." Old
// magnet radius of 6 was ~17% under wiki canon — orbs in the
// 6-7.25 block shell wouldn't begin gliding toward the player even
// though wiki canon attracts them. 7.25² ≈ 52.5625.
const MAGNET_RADIUS_SQ = 7.25 * 7.25;
const PICKUP_RADIUS_SQ = 1.2 * 1.2;
const MAGNET_SPEED = 3;

export interface XpOrbTickContext {
  playerPos: Vec3 | null;
  addXP: (value: number) => void;
}

export class XpOrbWorld {
  private readonly orbs = new Map<number, XpOrb>();
  private nextId = 1;

  // Drop `total` XP at a position, split into natural orb values (1, 3, 7,
  // 17, 37, ...) so the player sees multiple small orbs instead of one
  // giant one.
  drop(total: number, at: Vec3): readonly XpOrb[] {
    const denoms = [2477, 1237, 617, 307, 149, 73, 37, 17, 7, 3, 1];
    const created: XpOrb[] = [];
    let remaining = Math.floor(total);
    for (const d of denoms) {
      while (remaining >= d) {
        remaining -= d;
        const orb: XpOrb = {
          id: this.nextId++,
          value: d,
          position: { ...at },
          velocity: {
            x: (Math.random() - 0.5) * 0.5,
            y: 0.3 + Math.random() * 0.2,
            z: (Math.random() - 0.5) * 0.5,
          },
          ageSec: 0,
        };
        this.orbs.set(orb.id, orb);
        created.push(orb);
      }
    }
    return created;
  }

  remove(id: number): void {
    this.orbs.delete(id);
  }

  all(): IterableIterator<XpOrb> {
    return this.orbs.values();
  }

  get size(): number {
    return this.orbs.size;
  }

  tick(dtSec: number, ctx: XpOrbTickContext): void {
    const toDelete: number[] = [];
    for (const orb of this.orbs.values()) {
      orb.ageSec += dtSec;
      if (orb.ageSec >= DESPAWN_SEC) {
        toDelete.push(orb.id);
        continue;
      }
      if (ctx.playerPos) {
        const dx = ctx.playerPos.x - orb.position.x;
        const dy = ctx.playerPos.y - orb.position.y;
        const dz = ctx.playerPos.z - orb.position.z;
        const dSq = dx * dx + dy * dy + dz * dz;
        if (dSq <= PICKUP_RADIUS_SQ) {
          ctx.addXP(orb.value);
          toDelete.push(orb.id);
          continue;
        }
        if (dSq <= MAGNET_RADIUS_SQ) {
          const d = Math.sqrt(dSq) || 1;
          orb.velocity.x = (dx / d) * MAGNET_SPEED;
          orb.velocity.y = (dy / d) * MAGNET_SPEED;
          orb.velocity.z = (dz / d) * MAGNET_SPEED;
        }
      }
      orb.position.x += orb.velocity.x * dtSec;
      orb.position.y += orb.velocity.y * dtSec;
      orb.position.z += orb.velocity.z * dtSec;
      orb.velocity.y -= 10 * dtSec;
      orb.velocity.x *= 0.98;
      orb.velocity.z *= 0.98;
    }
    for (const id of toDelete) this.orbs.delete(id);
  }
}
