// Damage type registry. Each type has flags for bypasses.

export type DamageTypeId =
  | 'generic'
  | 'mob'
  | 'player'
  | 'arrow'
  | 'trident'
  | 'fireball'
  | 'fire'
  | 'lava'
  | 'hot_floor'
  | 'freeze'
  | 'drowning'
  | 'fall'
  | 'cactus'
  | 'explosion'
  | 'magic'
  | 'wither'
  | 'starve'
  | 'void'
  | 'thorns'
  | 'sonic_boom';

export interface DamageType {
  id: DamageTypeId;
  bypassesArmor: boolean;
  bypassesInvulnerability: boolean;
  scalesWithDifficulty: boolean;
  isFire: boolean;
}

const REGISTRY: Record<DamageTypeId, DamageType> = {
  generic: {
    id: 'generic',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: false,
  },
  mob: {
    id: 'mob',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: false,
  },
  player: {
    id: 'player',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  arrow: {
    id: 'arrow',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: false,
  },
  trident: {
    id: 'trident',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: false,
  },
  fireball: {
    id: 'fireball',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: true,
  },
  fire: {
    id: 'fire',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: true,
  },
  lava: {
    id: 'lava',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: true,
  },
  hot_floor: {
    id: 'hot_floor',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: true,
  },
  freeze: {
    id: 'freeze',
    bypassesArmor: true,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  drowning: {
    id: 'drowning',
    bypassesArmor: true,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  fall: {
    id: 'fall',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  cactus: {
    id: 'cactus',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  explosion: {
    id: 'explosion',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: false,
  },
  magic: {
    id: 'magic',
    bypassesArmor: true,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  wither: {
    id: 'wither',
    bypassesArmor: true,
    bypassesInvulnerability: false,
    scalesWithDifficulty: true,
    isFire: false,
  },
  starve: {
    id: 'starve',
    bypassesArmor: true,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  void: {
    id: 'void',
    bypassesArmor: true,
    bypassesInvulnerability: true,
    scalesWithDifficulty: false,
    isFire: false,
  },
  thorns: {
    id: 'thorns',
    bypassesArmor: false,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
  sonic_boom: {
    id: 'sonic_boom',
    bypassesArmor: true,
    bypassesInvulnerability: false,
    scalesWithDifficulty: false,
    isFire: false,
  },
};

export function getType(id: DamageTypeId): DamageType {
  return REGISTRY[id];
}

export function allTypeIds(): DamageTypeId[] {
  return Object.keys(REGISTRY) as DamageTypeId[];
}
