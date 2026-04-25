import { type MobKind, MOB_DEFS, type MobWorld, type Vec3 } from './mob';
import { pickSpawn } from '../world/biome_mob_spawn_table';

export interface SpawnOptions {
  maxHostile: number;
  maxPassive: number;
  minDistanceSq: number;
  maxDistanceSq: number;
  checkIntervalSec: number;
}

const DEFAULTS: SpawnOptions = {
  maxHostile: 4,
  maxPassive: 6,
  minDistanceSq: 5 * 5,
  maxDistanceSq: 24 * 24,
  checkIntervalSec: 5,
};

export interface SpawnContext {
  playerPos: Vec3;
  isDay: boolean;
  surfaceAt: (x: number, z: number) => number;
  isSolid: (x: number, y: number, z: number) => boolean;
  biomeAt?: (x: number, z: number) => string;
  rng?: () => number;
}

export class SpawnSystem {
  private sinceCheck = 0;
  private readonly opts: SpawnOptions;

  constructor(opts: Partial<SpawnOptions> = {}) {
    this.opts = { ...DEFAULTS, ...opts };
  }

  tick(dtSec: number, mobs: MobWorld, ctx: SpawnContext): void {
    this.sinceCheck += dtSec;
    if (this.sinceCheck < this.opts.checkIntervalSec) return;
    this.sinceCheck = 0;
    this.despawnFar(mobs, ctx);
    if (ctx.isDay) this.spawnPassive(mobs, ctx);
    else this.spawnHostile(mobs, ctx);
  }

  private spawnHostile(mobs: MobWorld, ctx: SpawnContext): void {
    const current = this.countHostile(mobs);
    if (current >= this.opts.maxHostile) return;
    const slot = this.findSpawnSlot(ctx);
    if (!slot) return;
    const rng = ctx.rng ?? Math.random;
    const biome = ctx.biomeAt?.(Math.floor(slot.x), Math.floor(slot.z)) ?? 'plains';
    const pick = pickSpawn(biome, 'monster', rng());
    const kind =
      pick && this.isKnownMobKind(pick.mob) ? (pick.mob as MobKind) : this.fallbackHostile(rng());
    mobs.spawn(kind, slot);
  }

  private spawnPassive(mobs: MobWorld, ctx: SpawnContext): void {
    const current = this.countPassive(mobs);
    if (current >= this.opts.maxPassive) return;
    const slot = this.findSpawnSlot(ctx);
    if (!slot) return;
    const rng = ctx.rng ?? Math.random;
    const biome = ctx.biomeAt?.(Math.floor(slot.x), Math.floor(slot.z)) ?? 'plains';
    const pick = pickSpawn(biome, 'creature', rng());
    const kind =
      pick && this.isKnownMobKind(pick.mob) ? (pick.mob as MobKind) : this.fallbackPassive(rng());
    mobs.spawn(kind, slot);
  }

  private isKnownMobKind(name: string): boolean {
    return Object.prototype.hasOwnProperty.call(MOB_DEFS, name);
  }

  private fallbackHostile(r: number): MobKind {
    return r < 0.2
      ? 'skeleton'
      : r < 0.4
        ? 'creeper'
        : r < 0.6
          ? 'spider'
          : r < 0.7
            ? 'enderman'
            : 'zombie';
  }

  private fallbackPassive(r: number): MobKind {
    return r < 0.25 ? 'pig' : r < 0.5 ? 'cow' : r < 0.75 ? 'sheep' : 'chicken';
  }

  private findSpawnSlot(ctx: SpawnContext): Vec3 | null {
    const rng = ctx.rng ?? Math.random;
    for (let attempt = 0; attempt < 20; attempt++) {
      const dx = (rng() - 0.5) * 2 * 24;
      const dz = (rng() - 0.5) * 2 * 24;
      const distSq = dx * dx + dz * dz;
      if (distSq < this.opts.minDistanceSq || distSq > this.opts.maxDistanceSq) continue;
      const x = Math.floor(ctx.playerPos.x + dx);
      const z = Math.floor(ctx.playerPos.z + dz);
      const y = ctx.surfaceAt(x, z) + 1;
      if (ctx.isSolid(x, y, z) || ctx.isSolid(x, y + 1, z)) continue;
      return { x: x + 0.5, y, z: z + 0.5 };
    }
    return null;
  }

  private despawnFar(mobs: MobWorld, ctx: SpawnContext): void {
    const max = this.opts.maxDistanceSq * 2;
    const toDrop: number[] = [];
    for (const mob of mobs.all()) {
      const dx = mob.position.x - ctx.playerPos.x;
      const dz = mob.position.z - ctx.playerPos.z;
      if (dx * dx + dz * dz > max) toDrop.push(mob.id);
    }
    for (const id of toDrop) mobs.remove(id);
  }

  private countHostile(mobs: MobWorld): number {
    let n = 0;
    for (const mob of mobs.all()) {
      if (mob.def.behavior === 'hostile' || mob.def.behavior === 'creeper') n++;
    }
    return n;
  }

  private countPassive(mobs: MobWorld): number {
    let n = 0;
    for (const mob of mobs.all()) {
      if (mob.def.behavior === 'passive') n++;
    }
    return n;
  }
}
