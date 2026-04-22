// Extra mob defs (phantom, dolphin, turtle, guardian, elder guardian,
// vex, breeze, drowned, husk, stray, bogged, glow squid, slime,
// magma cube, wandering trader, llama, ravager, ocelot, polar bear,
// panda, trader llama). Registered as an extension to MOB_DEFS.

import { MOB_DEFS, type MobDef, type MobKind } from './mob';

export type ExtraMobKind =
  | 'phantom'
  | 'dolphin'
  | 'turtle'
  | 'guardian'
  | 'elder_guardian'
  | 'vex'
  | 'breeze'
  | 'drowned'
  | 'husk'
  | 'stray'
  | 'bogged'
  | 'glow_squid'
  | 'slime'
  | 'magma_cube'
  | 'wandering_trader'
  | 'llama'
  | 'trader_llama'
  | 'ravager'
  | 'ocelot'
  | 'polar_bear'
  | 'panda'
  | 'hoglin'
  | 'zoglin'
  | 'strider'
  | 'zombified_piglin'
  | 'piglin_brute'
  | 'camel';

export const EXTRA_MOB_DEFS: Record<ExtraMobKind, MobDef> = {
  phantom: {
    kind: 'phantom' as MobKind,
    aabb: { halfX: 0.45, halfY: 0.25, halfZ: 0.45 },
    walkSpeed: 0, // phantoms fly
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 4,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 64 * 64,
  },
  dolphin: {
    kind: 'dolphin' as MobKind,
    aabb: { halfX: 0.45, halfY: 0.3, halfZ: 0.45 },
    walkSpeed: 1.8,
    maxHealth: 10,
    behavior: 'neutral',
    attackDamage: 3,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  turtle: {
    kind: 'turtle' as MobKind,
    aabb: { halfX: 0.6, halfY: 0.2, halfZ: 0.6 },
    walkSpeed: 0.3,
    maxHealth: 30,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  guardian: {
    kind: 'guardian' as MobKind,
    aabb: { halfX: 0.425, halfY: 0.425, halfZ: 0.425 },
    walkSpeed: 0,
    maxHealth: 30,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 16 * 16,
  },
  elder_guardian: {
    kind: 'elder_guardian' as MobKind,
    aabb: { halfX: 1, halfY: 1, halfZ: 1 },
    walkSpeed: 0,
    maxHealth: 80,
    behavior: 'hostile',
    attackDamage: 8,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 32 * 32,
  },
  vex: {
    kind: 'vex' as MobKind,
    aabb: { halfX: 0.2, halfY: 0.4, halfZ: 0.2 },
    walkSpeed: 0,
    maxHealth: 14,
    behavior: 'hostile',
    attackDamage: 4,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  breeze: {
    kind: 'breeze' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.4,
    maxHealth: 30,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 16 * 16,
    aggroRangeSq: 24 * 24,
  },
  drowned: {
    kind: 'drowned' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.8,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 8 * 8,
    aggroRangeSq: 16 * 16,
  },
  husk: {
    kind: 'husk' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 2,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 3,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  stray: {
    kind: 'stray' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.8,
    maxHealth: 20,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 8 * 8,
    aggroRangeSq: 16 * 16,
  },
  bogged: {
    kind: 'bogged' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.9, halfZ: 0.3 },
    walkSpeed: 1.8,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 2,
    attackRangeSq: 8 * 8,
    aggroRangeSq: 16 * 16,
  },
  glow_squid: {
    kind: 'glow_squid' as MobKind,
    aabb: { halfX: 0.4, halfY: 0.4, halfZ: 0.4 },
    walkSpeed: 0.6,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  slime: {
    kind: 'slime' as MobKind,
    aabb: { halfX: 0.5, halfY: 0.5, halfZ: 0.5 },
    walkSpeed: 1,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 4,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  magma_cube: {
    kind: 'magma_cube' as MobKind,
    aabb: { halfX: 0.5, halfY: 0.5, halfZ: 0.5 },
    walkSpeed: 1,
    maxHealth: 16,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 1.5 * 1.5,
    aggroRangeSq: 16 * 16,
  },
  wandering_trader: {
    kind: 'wandering_trader' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.95, halfZ: 0.3 },
    walkSpeed: 1.2,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  llama: {
    kind: 'llama' as MobKind,
    aabb: { halfX: 0.45, halfY: 0.9, halfZ: 0.45 },
    walkSpeed: 1.8,
    maxHealth: 22,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 3 * 3,
    aggroRangeSq: 8 * 8,
  },
  trader_llama: {
    kind: 'trader_llama' as MobKind,
    aabb: { halfX: 0.45, halfY: 0.9, halfZ: 0.45 },
    walkSpeed: 1.8,
    maxHealth: 22,
    behavior: 'neutral',
    attackDamage: 2,
    attackRangeSq: 3 * 3,
    aggroRangeSq: 8 * 8,
  },
  ravager: {
    kind: 'ravager' as MobKind,
    aabb: { halfX: 0.95, halfY: 1.1, halfZ: 1 },
    walkSpeed: 2.4,
    maxHealth: 100,
    behavior: 'hostile',
    attackDamage: 12,
    attackRangeSq: 3 * 3,
    aggroRangeSq: 32 * 32,
  },
  ocelot: {
    kind: 'ocelot' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.35, halfZ: 0.3 },
    walkSpeed: 2,
    maxHealth: 10,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  polar_bear: {
    kind: 'polar_bear' as MobKind,
    aabb: { halfX: 0.7, halfY: 0.7, halfZ: 0.7 },
    walkSpeed: 1.5,
    maxHealth: 30,
    behavior: 'neutral',
    attackDamage: 6,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  panda: {
    kind: 'panda' as MobKind,
    aabb: { halfX: 0.65, halfY: 0.65, halfZ: 0.65 },
    walkSpeed: 1.2,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  hoglin: {
    kind: 'hoglin' as MobKind,
    aabb: { halfX: 0.7, halfY: 0.7, halfZ: 0.7 },
    walkSpeed: 2,
    maxHealth: 40,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  zoglin: {
    kind: 'zoglin' as MobKind,
    aabb: { halfX: 0.7, halfY: 0.7, halfZ: 0.7 },
    walkSpeed: 2,
    maxHealth: 40,
    behavior: 'hostile',
    attackDamage: 6,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  strider: {
    kind: 'strider' as MobKind,
    aabb: { halfX: 0.45, halfY: 0.85, halfZ: 0.45 },
    walkSpeed: 0.7,
    maxHealth: 20,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
  zombified_piglin: {
    kind: 'zombified_piglin' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.95, halfZ: 0.3 },
    walkSpeed: 2,
    maxHealth: 20,
    behavior: 'neutral',
    attackDamage: 5,
    attackRangeSq: 1.8 * 1.8,
    aggroRangeSq: 35 * 35,
  },
  piglin_brute: {
    kind: 'piglin_brute' as MobKind,
    aabb: { halfX: 0.3, halfY: 0.95, halfZ: 0.3 },
    walkSpeed: 2.2,
    maxHealth: 50,
    behavior: 'hostile',
    attackDamage: 9,
    attackRangeSq: 2 * 2,
    aggroRangeSq: 16 * 16,
  },
  camel: {
    kind: 'camel' as MobKind,
    aabb: { halfX: 0.9, halfY: 1.2, halfZ: 0.9 },
    walkSpeed: 1.5,
    maxHealth: 32,
    behavior: 'passive',
    attackDamage: 0,
    attackRangeSq: 0,
    aggroRangeSq: 0,
  },
};

// Register all extras with MOB_DEFS.
export function registerExtraMobs(): void {
  for (const [name, def] of Object.entries(EXTRA_MOB_DEFS)) {
    (MOB_DEFS as Record<string, MobDef>)[name] = def;
  }
}
