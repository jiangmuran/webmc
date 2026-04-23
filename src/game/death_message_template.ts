export type DeathCause =
  | 'zombie'
  | 'skeleton'
  | 'creeper'
  | 'fall'
  | 'lava'
  | 'fire'
  | 'drowning'
  | 'starvation'
  | 'wither'
  | 'thorns'
  | 'void'
  | 'lightning'
  | 'cactus';

export function message(victim: string, cause: DeathCause, attackerName?: string): string {
  switch (cause) {
    case 'zombie':
      return `${victim} was slain by ${attackerName ?? 'a zombie'}`;
    case 'skeleton':
      return `${victim} was shot by ${attackerName ?? 'a skeleton'}`;
    case 'creeper':
      return `${victim} was blown up by ${attackerName ?? 'creeper'}`;
    case 'fall':
      return `${victim} hit the ground too hard`;
    case 'lava':
      return `${victim} tried to swim in lava`;
    case 'fire':
      return `${victim} burned to death`;
    case 'drowning':
      return `${victim} drowned`;
    case 'starvation':
      return `${victim} starved to death`;
    case 'wither':
      return `${victim} withered away`;
    case 'thorns':
      return `${victim} was killed by thorns`;
    case 'void':
      return `${victim} fell out of the world`;
    case 'lightning':
      return `${victim} was struck by lightning`;
    case 'cactus':
      return `${victim} was pricked to death`;
  }
}
