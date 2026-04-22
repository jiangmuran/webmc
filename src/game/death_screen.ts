// Death screen + death message. Displays a context-aware sentence based
// on how the player died, with optional attacker name. The showDeathMessages
// gamerule controls broadcast to other players.

export type DeathSource =
  | { kind: 'entity_attack'; attacker: string }
  | { kind: 'arrow'; attacker: string; distance: number }
  | { kind: 'fall' }
  | { kind: 'lava' }
  | { kind: 'fire' }
  | { kind: 'drown' }
  | { kind: 'suffocate' }
  | { kind: 'explosion'; attacker: string | null }
  | { kind: 'starve' }
  | { kind: 'freeze' }
  | { kind: 'void' }
  | { kind: 'magic'; source: string }
  | { kind: 'wither' }
  | { kind: 'cactus' }
  | { kind: 'anvil' }
  | { kind: 'stalactite' }
  | { kind: 'generic' };

export function deathMessage(playerName: string, source: DeathSource): string {
  switch (source.kind) {
    case 'entity_attack':
      return `${playerName} was slain by ${source.attacker}`;
    case 'arrow':
      return `${playerName} was shot by ${source.attacker}${source.distance > 50 ? ' from afar' : ''}`;
    case 'fall':
      return `${playerName} fell from a high place`;
    case 'lava':
      return `${playerName} tried to swim in lava`;
    case 'fire':
      return `${playerName} went up in flames`;
    case 'drown':
      return `${playerName} drowned`;
    case 'suffocate':
      return `${playerName} suffocated in a wall`;
    case 'explosion':
      return source.attacker
        ? `${playerName} was blown up by ${source.attacker}`
        : `${playerName} was blown up`;
    case 'starve':
      return `${playerName} starved to death`;
    case 'freeze':
      return `${playerName} froze to death`;
    case 'void':
      return `${playerName} fell out of the world`;
    case 'magic':
      return `${playerName} was killed by magic from ${source.source}`;
    case 'wither':
      return `${playerName} withered away`;
    case 'cactus':
      return `${playerName} was pricked to death`;
    case 'anvil':
      return `${playerName} was squashed by a falling anvil`;
    case 'stalactite':
      return `${playerName} was impaled on a stalactite`;
    case 'generic':
      return `${playerName} died`;
  }
}

export interface DeathScreen {
  message: string;
  respawnEnabled: boolean;
  scoreAtDeath: number;
  titleScreenAvailable: boolean;
}

export function makeDeathScreen(
  playerName: string,
  source: DeathSource,
  score: number,
): DeathScreen {
  return {
    message: deathMessage(playerName, source),
    respawnEnabled: true,
    scoreAtDeath: score,
    titleScreenAvailable: true,
  };
}
