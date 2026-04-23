// Split panic by category. Normal hostile panic → run home.
// Raid panic → hide indoors (non-raider villagers only).
// Illager-close panic → run away at 2x speed.

export type PanicSource = 'hostile' | 'raid' | 'illager' | 'hurt' | 'none';

export function speedMultiplier(src: PanicSource): number {
  if (src === 'illager') return 2;
  if (src === 'hurt') return 1.5;
  return 1.2;
}

export function refuge(src: PanicSource): 'house' | 'bed' | 'iron_golem' | 'none' {
  if (src === 'none') return 'none';
  if (src === 'raid') return 'house';
  if (src === 'hostile') return 'iron_golem';
  return 'bed';
}

export function durationTicks(src: PanicSource): number {
  if (src === 'illager') return 300;
  if (src === 'hurt') return 100;
  return 160;
}
