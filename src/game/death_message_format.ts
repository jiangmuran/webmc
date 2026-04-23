export type DeathCause =
  | { kind: 'fall' }
  | { kind: 'drown' }
  | { kind: 'burn' }
  | { kind: 'lava' }
  | { kind: 'mob'; mobName: string }
  | { kind: 'player'; playerName: string; weapon?: string }
  | { kind: 'void' }
  | { kind: 'starve' }
  | { kind: 'explosion'; source?: string }
  | { kind: 'freeze' };

export function deathMessage(victim: string, cause: DeathCause): string {
  switch (cause.kind) {
    case 'fall':
      return `${victim} hit the ground too hard`;
    case 'drown':
      return `${victim} drowned`;
    case 'burn':
      return `${victim} went up in flames`;
    case 'lava':
      return `${victim} tried to swim in lava`;
    case 'void':
      return `${victim} fell out of the world`;
    case 'starve':
      return `${victim} starved to death`;
    case 'freeze':
      return `${victim} froze to death`;
    case 'mob':
      return `${victim} was slain by ${cause.mobName}`;
    case 'player':
      return cause.weapon !== undefined && cause.weapon !== ''
        ? `${victim} was slain by ${cause.playerName} using ${cause.weapon}`
        : `${victim} was slain by ${cause.playerName}`;
    case 'explosion':
      return cause.source !== undefined && cause.source !== ''
        ? `${victim} was blown up by ${cause.source}`
        : `${victim} was blown up`;
  }
}
