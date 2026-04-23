export type GameMode = 'survival' | 'creative' | 'adventure' | 'spectator';

export interface ModeRules {
  takesDamage: boolean;
  canBreakBlocks: boolean;
  canFly: boolean;
  noClip: boolean;
  infiniteItems: boolean;
}

const TABLE: Record<GameMode, ModeRules> = {
  survival: {
    takesDamage: true,
    canBreakBlocks: true,
    canFly: false,
    noClip: false,
    infiniteItems: false,
  },
  creative: {
    takesDamage: false,
    canBreakBlocks: true,
    canFly: true,
    noClip: false,
    infiniteItems: true,
  },
  adventure: {
    takesDamage: true,
    canBreakBlocks: false,
    canFly: false,
    noClip: false,
    infiniteItems: false,
  },
  spectator: {
    takesDamage: false,
    canBreakBlocks: false,
    canFly: true,
    noClip: true,
    infiniteItems: false,
  },
};

export function rulesOf(m: GameMode): ModeRules {
  return TABLE[m];
}
