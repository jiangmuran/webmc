export type GameMode = 'survival' | 'creative' | 'adventure' | 'spectator';

export interface GameModeEffects {
  canFly: boolean;
  invulnerable: boolean;
  canBreakInstantly: boolean;
  canInteractWithBlocks: boolean;
  passThroughBlocks: boolean;
  drainHunger: boolean;
  keepInventoryOnDeath: boolean;
}

export const GAME_MODE_EFFECTS: Record<GameMode, GameModeEffects> = {
  survival: {
    canFly: false,
    invulnerable: false,
    canBreakInstantly: false,
    canInteractWithBlocks: true,
    passThroughBlocks: false,
    drainHunger: true,
    keepInventoryOnDeath: false,
  },
  creative: {
    canFly: true,
    invulnerable: true,
    canBreakInstantly: true,
    canInteractWithBlocks: true,
    passThroughBlocks: false,
    drainHunger: false,
    keepInventoryOnDeath: true,
  },
  adventure: {
    canFly: false,
    invulnerable: false,
    canBreakInstantly: false,
    canInteractWithBlocks: false,
    passThroughBlocks: false,
    drainHunger: true,
    keepInventoryOnDeath: false,
  },
  spectator: {
    canFly: true,
    invulnerable: true,
    canBreakInstantly: false,
    canInteractWithBlocks: false,
    passThroughBlocks: true,
    drainHunger: false,
    keepInventoryOnDeath: true,
  },
};

const CYCLE: readonly GameMode[] = ['survival', 'creative', 'adventure', 'spectator'];

export function nextGameMode(m: GameMode): GameMode {
  const i = CYCLE.indexOf(m);
  return CYCLE[(i + 1) % CYCLE.length] ?? 'survival';
}

export function effectsFor(m: GameMode): GameModeEffects {
  return GAME_MODE_EFFECTS[m];
}
