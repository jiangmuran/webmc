// Gamemode switch. Determines which attributes a player should have
// when switching between survival/creative/adventure/spectator.
//
//   survival: take damage, respawn, hunger, limited inventory pickup
//   creative: invulnerable, fly, infinite items, clip through entities
//   adventure: like survival but no block break/place unless CanPlace/
//              CanDestroy NBT is set
//   spectator: fly, noclip, invisible, no interaction, no attacks

export type Gamemode = 'survival' | 'creative' | 'adventure' | 'spectator';

export interface GamemodeAttributes {
  canTakeDamage: boolean;
  canFly: boolean;
  instantBlockBreak: boolean;
  infiniteItems: boolean;
  noclip: boolean;
  visible: boolean;
  canAttack: boolean;
  canBreakBlocks: boolean;
  canPlaceBlocks: boolean;
}

const ATTRS: Record<Gamemode, GamemodeAttributes> = {
  survival: {
    canTakeDamage: true,
    canFly: false,
    instantBlockBreak: false,
    infiniteItems: false,
    noclip: false,
    visible: true,
    canAttack: true,
    canBreakBlocks: true,
    canPlaceBlocks: true,
  },
  creative: {
    canTakeDamage: false,
    canFly: true,
    instantBlockBreak: true,
    infiniteItems: true,
    noclip: false,
    visible: true,
    canAttack: true,
    canBreakBlocks: true,
    canPlaceBlocks: true,
  },
  adventure: {
    canTakeDamage: true,
    canFly: false,
    instantBlockBreak: false,
    infiniteItems: false,
    noclip: false,
    visible: true,
    canAttack: true,
    canBreakBlocks: false,
    canPlaceBlocks: false,
  },
  spectator: {
    canTakeDamage: false,
    canFly: true,
    instantBlockBreak: false,
    infiniteItems: false,
    noclip: true,
    visible: false,
    canAttack: false,
    canBreakBlocks: false,
    canPlaceBlocks: false,
  },
};

export function attributesOf(mode: Gamemode): GamemodeAttributes {
  return ATTRS[mode];
}

// Switching from spectator → survival/creative lands the player back
// on the nearest solid ground.
export interface SwitchResult {
  groundSnap: boolean;
  resetFallDistance: boolean;
  keepInventory: boolean;
}

export function switchGamemode(from: Gamemode, to: Gamemode): SwitchResult {
  return {
    groundSnap: from === 'spectator' && to !== 'spectator',
    resetFallDistance: true,
    keepInventory: true,
  };
}

// Whether a player in gamemode X is allowed to attack a player in
// gamemode Y.
export function canAttackPlayer(attacker: Gamemode, target: Gamemode): boolean {
  if (!attributesOf(attacker).canAttack) return false;
  if (target === 'creative' || target === 'spectator') return false;
  return true;
}
