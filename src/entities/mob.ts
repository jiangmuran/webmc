import type { AABB, SolidSampler } from '@/physics/collision';
import { sweepMove } from '@/physics/collision';

export type MobKind =
  | 'pig'
  | 'cow'
  | 'sheep'
  | 'chicken'
  | 'wolf'
  | 'zombie'
  | 'skeleton'
  | 'creeper'
  | 'spider'
  | 'enderman'
  | 'ghast'
  | 'blaze'
  | 'piglin'
  | 'wither_skeleton'
  | 'ender_dragon'
  | 'shulker'
  | 'pillager'
  | 'vindicator'
  | 'evoker'
  | 'iron_golem'
  | 'snow_golem'
  | 'bee'
  | 'axolotl'
  | 'frog'
  | 'warden'
  | 'fox'
  | 'goat'
  | 'horse'
  | 'rabbit'
  | 'squid'
  | 'cat'
  | 'parrot'
  | 'witch'
  | 'mooshroom'
  | 'donkey'
  | 'mule'
  | 'llama'
  | 'panda'
  | 'turtle'
  | 'phantom'
  | 'salmon'
  | 'cod'
  | 'pufferfish'
  | 'tropical_fish'
  | 'dolphin'
  | 'guardian'
  | 'elder_guardian'
  | 'glow_squid'
  | 'magma_cube'
  | 'slime'
  | 'silverfish'
  | 'cave_spider'
  | 'husk'
  | 'drowned'
  | 'stray'
  | 'bogged'
  | 'breeze'
  | 'sniffer'
  | 'armadillo'
  | 'bat'
  | 'allay'
  | 'vex'
  | 'wandering_trader'
  | 'villager'
  | 'zombie_villager'
  | 'zoglin'
  | 'hoglin'
  | 'strider'
  | 'piglin_brute'
  | 'zombified_piglin'
  | 'wither';

export type MobBehavior = 'passive' | 'hostile' | 'neutral' | 'creeper' | 'enderman';

export interface MobDef {
  kind: MobKind;
  aabb: AABB;
  walkSpeed: number;
  maxHealth: number;
  behavior: MobBehavior;
  attackDamage: number;
  attackRangeSq: number;
  aggroRangeSq: number;
  jumpVelocity?: number;
}

const TALL_BOX: AABB = { halfX: 0.3, halfY: 0.9, halfZ: 0.3 };
const MEDIUM_BOX: AABB = { halfX: 0.45, halfY: 0.45, halfZ: 0.45 };
const SMALL_BOX: AABB = { halfX: 0.2, halfY: 0.3, halfZ: 0.2 };
const SPIDER_BOX: AABB = { halfX: 0.7, halfY: 0.45, halfZ: 0.7 };

export const MOB_DEFS: Record<MobKind, MobDef> = {
  pig: {
    kind: 'pig',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.2,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  cow: {
    kind: 'cow',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.1,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  sheep: {
    kind: 'sheep',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.1,
    maxHealth: 8,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  chicken: {
    kind: 'chicken',
    aabb: SMALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 4,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  wolf: {
    kind: 'wolf',
    aabb: MEDIUM_BOX,
    walkSpeed: 3.0,
    maxHealth: 8,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  zombie: {
    kind: 'zombie',
    aabb: TALL_BOX,
    walkSpeed: 2.0,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  skeleton: {
    kind: 'skeleton',
    aabb: TALL_BOX,
    walkSpeed: 1.8,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 1,
    attackRangeSq: 8 * 8,
    aggroRangeSq: 16 * 16,
  },
  creeper: {
    kind: 'creeper',
    aabb: TALL_BOX,
    walkSpeed: 2.2,
    maxHealth: 20,
    behavior: 'creeper',
    attackDamage: 12,
    attackRangeSq: 2.5 * 2.5,
    aggroRangeSq: 16 * 16,
  },
  spider: {
    kind: 'spider',
    aabb: SPIDER_BOX,
    walkSpeed: 2.4,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 1.8 * 1.8,
    aggroRangeSq: 16 * 16,
    jumpVelocity: 8,
  },
  enderman: {
    kind: 'enderman',
    aabb: { halfX: 0.3, halfY: 1.45, halfZ: 0.3 },
    walkSpeed: 2.6,
    maxHealth: 40,
    behavior: 'enderman',
    attackDamage: 4,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 24 * 24,
  },
  ghast: {
    kind: 'ghast',
    aabb: { halfX: 2, halfY: 2, halfZ: 2 },
    walkSpeed: 0,
    maxHealth: 10,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 48 * 48,
    aggroRangeSq: 64 * 64,
  },
  blaze: {
    kind: 'blaze',
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.5,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 24 * 24,
  },
  piglin: {
    kind: 'piglin',
    aabb: TALL_BOX,
    walkSpeed: 2.1,
    maxHealth: 16,
    behavior: 'neutral',
    attackDamage: 3,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  wither_skeleton: {
    kind: 'wither_skeleton',
    aabb: { halfX: 0.3, halfY: 1.2, halfZ: 0.3 },
    walkSpeed: 2.2,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 5,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  ender_dragon: {
    kind: 'ender_dragon',
    aabb: { halfX: 8, halfY: 4, halfZ: 8 },
    walkSpeed: 0,
    maxHealth: 200,
    behavior: 'hostile',
    attackDamage: 10,
    attackRangeSq: 6 * 6,
    aggroRangeSq: 128 * 128,
  },
  shulker: {
    kind: 'shulker',
    aabb: { halfX: 0.5, halfY: 0.5, halfZ: 0.5 },
    walkSpeed: 0,
    maxHealth: 30,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 16 * 16,
  },
  pillager: {
    kind: 'pillager',
    aabb: TALL_BOX,
    walkSpeed: 1.8,
    maxHealth: 24,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 8 * 8,
    aggroRangeSq: 16 * 16,
  },
  vindicator: {
    kind: 'vindicator',
    aabb: TALL_BOX,
    walkSpeed: 2.0,
    maxHealth: 24,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 1.6 * 1.6,
    aggroRangeSq: 16 * 16,
  },
  evoker: {
    kind: 'evoker',
    aabb: TALL_BOX,
    walkSpeed: 1.5,
    maxHealth: 24,
    behavior: 'hostile',
    attackDamage: 4,
    attackRangeSq: 12 * 12,
    aggroRangeSq: 16 * 16,
  },
  iron_golem: {
    kind: 'iron_golem',
    aabb: { halfX: 0.7, halfY: 1.35, halfZ: 0.7 },
    walkSpeed: 1.8,
    maxHealth: 100,
    behavior: 'neutral',
    attackDamage: 8,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  snow_golem: {
    kind: 'snow_golem',
    aabb: { halfX: 0.35, halfY: 0.95, halfZ: 0.35 },
    walkSpeed: 1.6,
    maxHealth: 4,
    behavior: 'neutral',
    attackDamage: 0,
    attackRangeSq: 10 * 10,
    aggroRangeSq: 16 * 16,
  },
  bee: {
    kind: 'bee',
    aabb: { halfX: 0.3, halfY: 0.3, halfZ: 0.3 },
    walkSpeed: 1.2,
    maxHealth: 10,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  axolotl: {
    kind: 'axolotl',
    aabb: { halfX: 0.3, halfY: 0.3, halfZ: 0.3 },
    walkSpeed: 1,
    maxHealth: 14,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  frog: {
    kind: 'frog',
    aabb: { halfX: 0.3, halfY: 0.3, halfZ: 0.3 },
    walkSpeed: 1,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  warden: {
    kind: 'warden',
    aabb: { halfX: 0.45, halfY: 1.45, halfZ: 0.45 },
    walkSpeed: 2.6,
    maxHealth: 500,
    behavior: 'hostile',
    attackDamage: 30,
    attackRangeSq: 4 * 4,
    aggroRangeSq: 20 * 20,
  },
  fox: {
    kind: 'fox',
    aabb: { halfX: 0.3, halfY: 0.4, halfZ: 0.3 },
    walkSpeed: 2.2,
    maxHealth: 10,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 12 * 12,
  },
  goat: {
    kind: 'goat',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.2,
    maxHealth: 10,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 12 * 12,
    jumpVelocity: 9,
  },
  horse: {
    kind: 'horse',
    aabb: { halfX: 0.7, halfY: 0.8, halfZ: 0.7 },
    walkSpeed: 2.0,
    maxHealth: 16,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  rabbit: {
    kind: 'rabbit',
    aabb: SMALL_BOX,
    walkSpeed: 1.6,
    maxHealth: 3,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  squid: {
    kind: 'squid',
    aabb: MEDIUM_BOX,
    walkSpeed: 0.8,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  cat: {
    kind: 'cat',
    aabb: SMALL_BOX,
    walkSpeed: 1.2,
    maxHealth: 10,
    behavior: 'neutral',
    attackDamage: 1,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 8 * 8,
  },
  parrot: {
    kind: 'parrot',
    aabb: SMALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 6,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  witch: {
    kind: 'witch',
    aabb: TALL_BOX,
    walkSpeed: 1.5,
    maxHealth: 26,
    behavior: 'hostile',
    attackDamage: 4,
    attackRangeSq: 25,
    aggroRangeSq: 256,
  },
  mooshroom: {
    kind: 'mooshroom',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.0,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  donkey: {
    kind: 'donkey',
    aabb: TALL_BOX,
    walkSpeed: 1.7,
    maxHealth: 16,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  mule: {
    kind: 'mule',
    aabb: TALL_BOX,
    walkSpeed: 1.7,
    maxHealth: 16,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  llama: {
    kind: 'llama',
    aabb: TALL_BOX,
    walkSpeed: 1.6,
    maxHealth: 22,
    behavior: 'neutral',
    attackDamage: 1,
    attackRangeSq: 9,
    aggroRangeSq: 64,
  },
  panda: {
    kind: 'panda',
    aabb: MEDIUM_BOX,
    walkSpeed: 0.9,
    maxHealth: 20,
    behavior: 'neutral',
    attackDamage: 6,
    attackRangeSq: 4,
    aggroRangeSq: 100,
  },
  turtle: {
    kind: 'turtle',
    aabb: SMALL_BOX,
    walkSpeed: 0.5,
    maxHealth: 30,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  phantom: {
    kind: 'phantom',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.8,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 4,
    aggroRangeSq: 256,
  },
  salmon: {
    kind: 'salmon',
    aabb: SMALL_BOX,
    walkSpeed: 1.3,
    maxHealth: 3,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  cod: {
    kind: 'cod',
    aabb: SMALL_BOX,
    walkSpeed: 1.3,
    maxHealth: 3,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  pufferfish: {
    kind: 'pufferfish',
    aabb: SMALL_BOX,
    walkSpeed: 0.8,
    maxHealth: 3,
    behavior: 'neutral',
    attackDamage: 1,
    attackRangeSq: 4,
    aggroRangeSq: 16,
  },
  tropical_fish: {
    kind: 'tropical_fish',
    aabb: SMALL_BOX,
    walkSpeed: 1.3,
    maxHealth: 3,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  dolphin: {
    kind: 'dolphin',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.5,
    maxHealth: 10,
    behavior: 'neutral',
    attackDamage: 3,
    attackRangeSq: 9,
    aggroRangeSq: 144,
  },
  guardian: {
    kind: 'guardian',
    aabb: MEDIUM_BOX,
    walkSpeed: 1.0,
    maxHealth: 30,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 64,
    aggroRangeSq: 256,
  },
  elder_guardian: {
    kind: 'elder_guardian',
    aabb: TALL_BOX,
    walkSpeed: 1.0,
    maxHealth: 80,
    behavior: 'hostile',
    attackDamage: 8,
    attackRangeSq: 100,
    aggroRangeSq: 400,
  },
  glow_squid: {
    kind: 'glow_squid',
    aabb: MEDIUM_BOX,
    walkSpeed: 0.7,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  magma_cube: {
    kind: 'magma_cube',
    aabb: MEDIUM_BOX,
    walkSpeed: 0.8,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 5,
    attackRangeSq: 4,
    aggroRangeSq: 100,
  },
  slime: {
    kind: 'slime',
    aabb: MEDIUM_BOX,
    walkSpeed: 0.7,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 4,
    attackRangeSq: 4,
    aggroRangeSq: 100,
  },
  silverfish: {
    kind: 'silverfish',
    aabb: SMALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 8,
    behavior: 'hostile',
    attackDamage: 1,
    attackRangeSq: 2,
    aggroRangeSq: 64,
  },
  cave_spider: {
    kind: 'cave_spider',
    aabb: SMALL_BOX,
    walkSpeed: 1.6,
    maxHealth: 12,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 3,
    aggroRangeSq: 100,
  },
  husk: {
    kind: 'husk',
    aabb: TALL_BOX,
    walkSpeed: 1.1,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 4,
    aggroRangeSq: 144,
  },
  drowned: {
    kind: 'drowned',
    aabb: TALL_BOX,
    walkSpeed: 1.0,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 4,
    aggroRangeSq: 144,
  },
  stray: {
    kind: 'stray',
    aabb: TALL_BOX,
    walkSpeed: 1.2,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 100,
    aggroRangeSq: 256,
  },
  bogged: {
    kind: 'bogged',
    aabb: TALL_BOX,
    walkSpeed: 1.2,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 100,
    aggroRangeSq: 256,
  },
  breeze: {
    kind: 'breeze',
    aabb: TALL_BOX,
    walkSpeed: 1.5,
    maxHealth: 30,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 64,
    aggroRangeSq: 256,
  },
  sniffer: {
    kind: 'sniffer',
    aabb: TALL_BOX,
    walkSpeed: 0.5,
    maxHealth: 14,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  armadillo: {
    kind: 'armadillo',
    aabb: SMALL_BOX,
    walkSpeed: 0.6,
    maxHealth: 12,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  bat: {
    kind: 'bat',
    aabb: SMALL_BOX,
    walkSpeed: 0.8,
    maxHealth: 6,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  allay: {
    kind: 'allay',
    aabb: SMALL_BOX,
    walkSpeed: 1.2,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  vex: {
    kind: 'vex',
    aabb: SMALL_BOX,
    walkSpeed: 1.6,
    maxHealth: 14,
    behavior: 'hostile',
    attackDamage: 5,
    attackRangeSq: 4,
    aggroRangeSq: 100,
  },
  wandering_trader: {
    kind: 'wandering_trader',
    aabb: TALL_BOX,
    walkSpeed: 1.0,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  villager: {
    kind: 'villager',
    aabb: TALL_BOX,
    walkSpeed: 1.0,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  zombie_villager: {
    kind: 'zombie_villager',
    aabb: TALL_BOX,
    walkSpeed: 1.1,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 4,
    aggroRangeSq: 144,
  },
  zoglin: {
    kind: 'zoglin',
    aabb: TALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 40,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 4,
    aggroRangeSq: 256,
  },
  hoglin: {
    kind: 'hoglin',
    aabb: TALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 40,
    behavior: 'neutral',
    attackDamage: 6,
    attackRangeSq: 4,
    aggroRangeSq: 256,
  },
  strider: {
    kind: 'strider',
    aabb: TALL_BOX,
    walkSpeed: 0.7,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  piglin_brute: {
    kind: 'piglin_brute',
    aabb: TALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 50,
    behavior: 'hostile',
    attackDamage: 13,
    attackRangeSq: 4,
    aggroRangeSq: 256,
  },
  zombified_piglin: {
    kind: 'zombified_piglin',
    aabb: TALL_BOX,
    walkSpeed: 1.2,
    maxHealth: 20,
    behavior: 'neutral',
    attackDamage: 5,
    attackRangeSq: 4,
    aggroRangeSq: 256,
  },
  wither: {
    kind: 'wither',
    aabb: TALL_BOX,
    walkSpeed: 1.4,
    maxHealth: 300,
    behavior: 'hostile',
    attackDamage: 12,
    attackRangeSq: 100,
    aggroRangeSq: 400,
  },
};

export type MobId = number;

export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export interface Mob {
  readonly id: MobId;
  readonly def: MobDef;
  position: Vec3;
  velocity: Vec3;
  yaw: number;
  health: number;
  onGround: boolean;
  attackCooldownSec: number;
  aggroTargetId: MobId | null;
  // Neutral mobs go aggressive after being struck; wolf keeps a grudge.
  provoked: boolean;
  // Creepers prime a fuse when within attackRange; tracks remaining time.
  fuseSec: number;
  // Endermen teleport randomly on a timer when aggroed.
  teleportCooldownSec: number;
  // Hurt flash timer — renderer tints mob red while > 0.
  hurtFlashSec: number;
  // Death animation: set when killed; renderer scales down over dyingSec.
  dyingSec: number;
  // Peak Y while airborne — used to compute fall damage on land.
  airborneStartY: number | null;
  // Flee timer: passive mobs that took damage run away for this many seconds.
  fleeingSec: number;
}

const GRAVITY = 32;
const TERMINAL_VELOCITY = 50;
const ATTACK_COOLDOWN_SEC = 0.8;

// 16-step stepwise solidity check between two world positions. Used as a
// cheap "can this mob see the player" gate so attacks don't pass through
// walls. We sample at the entity heads (mob.y + halfY, player.y + 0.6)
// rather than the feet, mirroring vanilla which casts from eye level.
function hasLineOfSight(fromPos: Vec3, toPos: Vec3, isSolid: SolidSampler): boolean {
  const fx = fromPos.x;
  const fy = fromPos.y + 0.6;
  const fz = fromPos.z;
  const tx = toPos.x;
  const ty = toPos.y + 0.6;
  const tz = toPos.z;
  const STEPS = 16;
  for (let i = 1; i < STEPS; i++) {
    const t = i / STEPS;
    const x = Math.floor(fx + (tx - fx) * t);
    const y = Math.floor(fy + (ty - fy) * t);
    const z = Math.floor(fz + (tz - fz) * t);
    if (isSolid(x, y, z)) return false;
  }
  return true;
}

export interface MobTickContext {
  isSolid: SolidSampler;
  playerPos: Vec3 | null;
  damagePlayer: (amount: number, attackerPos?: Vec3) => void;
  onCreeperExplode?: (x: number, y: number, z: number) => void;
  // True when the mob is in direct sunlight (day + top-of-world exposure).
  isSunlit?: (x: number, y: number, z: number) => boolean;
  // Returns 'water' / 'lava' / null at a voxel position. Used for mob
  // buoyancy — without it, mobs sank to the bottom of any water and
  // walked along the floor like the seafloor was a road.
  isFluid?: (x: number, y: number, z: number) => 'water' | 'lava' | null;
  // Vanilla MC: sneaking reduces mob detection range by ~4 blocks (fully
  // invisible at >16 blocks if sneaking). When true, aggroRangeSq is
  // multiplied by ~0.5 to halve the detection distance.
  playerSneaking?: boolean;
}

export class MobWorld {
  private readonly mobs = new Map<MobId, Mob>();
  private nextId: MobId = 1;

  spawn(kind: MobKind, position: Vec3): Mob {
    const def = MOB_DEFS[kind];
    const mob: Mob = {
      id: this.nextId++,
      def,
      position: { ...position },
      velocity: { x: 0, y: 0, z: 0 },
      yaw: 0,
      health: def.maxHealth,
      onGround: false,
      attackCooldownSec: 0,
      aggroTargetId: null,
      provoked: false,
      fuseSec: 0,
      teleportCooldownSec: 0,
      hurtFlashSec: 0,
      dyingSec: 0,
      airborneStartY: null,
      fleeingSec: 0,
    };
    this.mobs.set(mob.id, mob);
    return mob;
  }

  remove(id: MobId): void {
    this.mobs.delete(id);
  }

  all(): IterableIterator<Mob> {
    return this.mobs.values();
  }

  get size(): number {
    return this.mobs.size;
  }

  damage(id: MobId, amount: number): { killed: boolean; kind: MobKind; position: Vec3 } | null {
    const m = this.mobs.get(id);
    if (!m || m.dyingSec > 0) return null;
    m.health -= amount;
    m.hurtFlashSec = 0.18;
    if (m.def.behavior === 'neutral' || m.def.behavior === 'enderman') m.provoked = true;
    if (m.def.behavior === 'passive') m.fleeingSec = 5;
    if (m.health <= 0) {
      m.dyingSec = 0.35;
      return { killed: true, kind: m.def.kind, position: { ...m.position } };
    }
    return { killed: false, kind: m.def.kind, position: { ...m.position } };
  }

  tick(dtSec: number, ctx: MobTickContext): void {
    // Vanilla mob despawn: mobs > 128 blocks from any player despawn instantly,
    // mobs 32–128 blocks roll a small chance per tick. Without this, mobs
    // accumulated forever as the player explored — every chunk the player
    // visited contributed to a permanent population, and FPS slowly tanked.
    if (ctx.playerPos !== null) {
      const px = ctx.playerPos.x;
      const py = ctx.playerPos.y;
      const pz = ctx.playerPos.z;
      const toRemove: MobId[] = [];
      for (const m of this.mobs.values()) {
        if (m.dyingSec > 0) continue;
        // Persistent mobs (named, tamed, baby, leashed, breeding) stay
        // forever — same as vanilla. We don't track named/tamed here yet,
        // so skip babies as the only persistent class for now.
        const dx = m.position.x - px;
        const dy = m.position.y - py;
        const dz = m.position.z - pz;
        const distSq = dx * dx + dy * dy + dz * dz;
        if (distSq > 128 * 128) {
          toRemove.push(m.id);
        } else if (distSq > 32 * 32 && Math.random() < dtSec * 0.5) {
          // Random chance ~ 1/120s at the 32-block boundary — half-life
          // around 4 minutes for distant mobs.
          toRemove.push(m.id);
        } else if (m.position.y < -64) {
          // Void cleanup. Mobs that fell off the world (player digs a 1-
          // block hole, enemies fall in, world generates with caves to
          // -64) used to live forever at y=-Infinity, ticking gravity
          // every frame. Drop them immediately like vanilla void damage.
          toRemove.push(m.id);
        }
      }
      for (const id of toRemove) this.mobs.delete(id);
    }
    for (const mob of this.mobs.values()) this.tickMob(mob, dtSec, ctx);
  }

  private isAggroTarget(mob: Mob): boolean {
    switch (mob.def.behavior) {
      case 'passive':
        return false;
      case 'hostile':
      case 'creeper':
        return true;
      case 'neutral':
      case 'enderman':
        return mob.provoked;
    }
  }

  private tickMob(mob: Mob, dtSec: number, ctx: MobTickContext): void {
    if (mob.dyingSec > 0) {
      mob.dyingSec = Math.max(0, mob.dyingSec - dtSec);
      if (mob.dyingSec === 0) this.mobs.delete(mob.id);
      return;
    }
    if (mob.attackCooldownSec > 0)
      mob.attackCooldownSec = Math.max(0, mob.attackCooldownSec - dtSec);
    if (mob.teleportCooldownSec > 0)
      mob.teleportCooldownSec = Math.max(0, mob.teleportCooldownSec - dtSec);
    if (mob.hurtFlashSec > 0) mob.hurtFlashSec = Math.max(0, mob.hurtFlashSec - dtSec);
    if (mob.fleeingSec > 0) mob.fleeingSec = Math.max(0, mob.fleeingSec - dtSec);

    // Sunlight burn for undead hostile mobs (zombie/skeleton).
    if (
      ctx.isSunlit &&
      (mob.def.kind === 'zombie' || mob.def.kind === 'skeleton') &&
      ctx.isSunlit(mob.position.x, mob.position.y, mob.position.z)
    ) {
      mob.health -= 0.5 * dtSec;
      if (Math.random() < dtSec * 0.7) mob.hurtFlashSec = 0.15;
      if (mob.health <= 0 && mob.dyingSec === 0) mob.dyingSec = 0.35;
    }

    // Passive mobs flee from player while fleeingSec > 0.
    if (mob.fleeingSec > 0 && ctx.playerPos && mob.def.behavior === 'passive') {
      const dx = mob.position.x - ctx.playerPos.x;
      const dz = mob.position.z - ctx.playerPos.z;
      const len = Math.hypot(dx, dz) || 1;
      mob.velocity.x = (dx / len) * mob.def.walkSpeed * 1.4;
      mob.velocity.z = (dz / len) * mob.def.walkSpeed * 1.4;
      mob.yaw = Math.atan2(dx / len, dz / len);
    }

    const aggro = this.isAggroTarget(mob);
    if (aggro && ctx.playerPos) {
      const dx = ctx.playerPos.x - mob.position.x;
      const dy = ctx.playerPos.y - mob.position.y;
      const dz = ctx.playerPos.z - mob.position.z;
      // 3D distance for aggro check — old code used horizontal-only, so a
      // zombie 50 blocks below the player could still chase up through
      // walls because horizontal dx² + dz² alone was within aggro range.
      // Vanilla uses full 3D bounding-box distance.
      const distSq = dx * dx + dy * dy + dz * dz;
      // Sneak reduces aggro radius. Vanilla applies a ~0.5x factor on the
      // detection range when the player is sneaking (effective ~half-radius
      // squared); without this, sneaking through a cave was indistinguishable
      // from sprinting in.
      const effectiveAggroSq = ctx.playerSneaking
        ? mob.def.aggroRangeSq * 0.25
        : mob.def.aggroRangeSq;
      if (distSq <= effectiveAggroSq) {
        // Movement velocity uses horizontal-only direction so mobs don't
        // crawl when the player is high above (e.g. on a 3-block tower).
        // Aggro distSq above is 3D for vanilla parity, but the chase
        // direction stays in the xz plane.
        const horizLen = Math.hypot(dx, dz) || 1;
        const nx = dx / horizLen;
        const nz = dz / horizLen;
        mob.velocity.x = nx * mob.def.walkSpeed;
        mob.velocity.z = nz * mob.def.walkSpeed;
        const targetYaw = Math.atan2(nx, nz);
        const twoPi = Math.PI * 2;
        let dYaw = targetYaw - mob.yaw;
        while (dYaw > Math.PI) dYaw -= twoPi;
        while (dYaw < -Math.PI) dYaw += twoPi;
        mob.yaw += dYaw * Math.min(1, dtSec * 6);

        if (mob.def.behavior === 'creeper') {
          // Creepers need LOS too — without it they'd tick the fuse from
          // around a wall and detonate against the wall. Path of least
          // surprise: only fuse-up when the player is actually visible.
          if (
            distSq <= mob.def.attackRangeSq &&
            hasLineOfSight(mob.position, ctx.playerPos, ctx.isSolid)
          ) {
            mob.fuseSec += dtSec;
            if (mob.fuseSec >= 1.5) {
              ctx.damagePlayer(mob.def.attackDamage, mob.position);
              ctx.onCreeperExplode?.(mob.position.x, mob.position.y, mob.position.z);
              this.mobs.delete(mob.id);
              return;
            }
          } else {
            mob.fuseSec = Math.max(0, mob.fuseSec - dtSec);
          }
        } else if (
          distSq <= mob.def.attackRangeSq &&
          mob.attackCooldownSec === 0 &&
          // Line-of-sight gate: zombies were punching the player through
          // a wall, skeletons were sniping through ceilings. Mobs only
          // attack when there's a clear voxel path from their head to
          // the player's head.
          hasLineOfSight(mob.position, ctx.playerPos, ctx.isSolid)
        ) {
          ctx.damagePlayer(mob.def.attackDamage, mob.position);
          mob.attackCooldownSec = ATTACK_COOLDOWN_SEC;
        }

        if (mob.def.jumpVelocity && mob.onGround && distSq <= 4 * 4) {
          mob.velocity.y = mob.def.jumpVelocity;
          mob.onGround = false;
        }

        if (mob.def.behavior === 'enderman' && mob.teleportCooldownSec === 0) {
          mob.teleportCooldownSec = 3;
          mob.position.x += (Math.random() - 0.5) * 6;
          mob.position.z += (Math.random() - 0.5) * 6;
        }
      } else {
        mob.velocity.x *= 0.9;
        mob.velocity.z *= 0.9;
      }
    } else {
      mob.velocity.x *= 0.9;
      mob.velocity.z *= 0.9;
    }

    // Buoyancy in water: gentle upward velocity + drag. Vanilla mobs
    // bob up to the surface instead of sinking to the floor; without
    // this, cows that walked into a river sat on the riverbed forever.
    // Lava: same but slower (vanilla parity for mobs that don't burn).
    const inFluidHere = ctx.isFluid?.(
      Math.floor(mob.position.x),
      Math.floor(mob.position.y),
      Math.floor(mob.position.z),
    );
    if (inFluidHere === 'water') {
      mob.velocity.y = Math.min(mob.velocity.y + 12 * dtSec, 4);
      mob.velocity.x *= Math.max(0, 1 - dtSec * 4);
      mob.velocity.z *= Math.max(0, 1 - dtSec * 4);
    } else if (inFluidHere === 'lava') {
      mob.velocity.y = Math.min(mob.velocity.y + 6 * dtSec, 2);
      mob.velocity.x *= Math.max(0, 1 - dtSec * 6);
      mob.velocity.z *= Math.max(0, 1 - dtSec * 6);
      // Lava burn damage. Vanilla MC: most mobs take 4 HP/sec in lava.
      // Fire-immune mobs (nether natives + the wither / ender dragon)
      // are unaffected. Without this, mobs walked through lava fields
      // without harm — easy farming abuse if you funneled them in.
      const fireImmune =
        mob.def.kind === 'blaze' ||
        mob.def.kind === 'ghast' ||
        mob.def.kind === 'magma_cube' ||
        mob.def.kind === 'strider' ||
        mob.def.kind === 'zombified_piglin' ||
        mob.def.kind === 'piglin' ||
        mob.def.kind === 'piglin_brute' ||
        mob.def.kind === 'wither' ||
        mob.def.kind === 'wither_skeleton' ||
        mob.def.kind === 'ender_dragon';
      if (!fireImmune) {
        mob.health -= 4 * dtSec;
        mob.hurtFlashSec = Math.max(mob.hurtFlashSec, 0.18);
        if (mob.health <= 0 && mob.dyingSec === 0) mob.dyingSec = 0.35;
      }
    } else {
      mob.velocity.y = Math.max(mob.velocity.y - GRAVITY * dtSec, -TERMINAL_VELOCITY);
    }

    const dv = {
      x: mob.velocity.x * dtSec,
      y: mob.velocity.y * dtSec,
      z: mob.velocity.z * dtSec,
    };
    const wasOnGround = mob.onGround;
    // Mob step height was 0.6 (matched the player) so 1-block-tall walls
    // brick-walled every hostile mob — zombies would just shove against
    // the wall of a player's shelter forever. Vanilla mobs step up 1.0
    // (vex/horse/etc. step higher; we use a flat 1 here for simplicity).
    const result = sweepMove(mob.position, mob.def.aabb, dv, ctx.isSolid, 1.0);
    // Auto-jump when blocked by a wall while chasing. Step-up handles 1-
    // block ledges, but anything taller (2-block fence, terrace, snow
    // pile) needs an actual jump. Vanilla zombies/skeletons hop when
    // pathing into a wall — without this they grind against the wall
    // forever instead of trying to climb. Only fires when actively aggro
    // so peaceful wandering mobs don't bunny-hop pointlessly.
    if (result.hitX) mob.velocity.x = 0;
    if (result.hitY) mob.velocity.y = 0;
    if (result.hitZ) mob.velocity.z = 0;
    if (
      (result.hitX || result.hitZ) &&
      mob.onGround &&
      this.isAggroTarget(mob) &&
      ctx.playerPos !== null
    ) {
      // Jump after the wall-clear pass so hitY (if any) doesn't wipe the
      // upward velocity we're about to set.
      mob.velocity.y = 7.5;
    }
    mob.onGround = result.onGround;
    if (!wasOnGround && mob.onGround && mob.airborneStartY !== null) {
      const fall = mob.airborneStartY - mob.position.y;
      // Vanilla MC: chickens, parrots, bats, allay, bees, vexes don't
      // take fall damage; cats take half. Without this, dropping a
      // chicken from any height killed it instantly. Use kind to gate
      // — cleaner than per-mob def flags for this small list.
      const noFall =
        mob.def.kind === 'chicken' ||
        mob.def.kind === 'parrot' ||
        mob.def.kind === 'bat' ||
        mob.def.kind === 'allay' ||
        mob.def.kind === 'bee' ||
        mob.def.kind === 'vex' ||
        mob.def.kind === 'phantom' ||
        mob.def.kind === 'ghast' ||
        mob.def.kind === 'blaze';
      if (fall > 3 && !noFall) {
        mob.health -= fall - 3;
        mob.hurtFlashSec = 0.18;
        if (mob.health <= 0) mob.dyingSec = 0.35;
      }
      mob.airborneStartY = null;
    } else if (!mob.onGround) {
      if (mob.airborneStartY === null || mob.position.y > mob.airborneStartY) {
        mob.airborneStartY = mob.position.y;
      }
    } else if (mob.onGround) {
      mob.airborneStartY = null;
    }
  }
}
