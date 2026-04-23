export type AppleKind = 'normal' | 'enchanted';

export interface Effect {
  id: string;
  amplifier: number;
  durationTicks: number;
}

export function effectsOf(kind: AppleKind): Effect[] {
  if (kind === 'enchanted') {
    return [
      { id: 'regeneration', amplifier: 1, durationTicks: 400 },
      { id: 'absorption', amplifier: 3, durationTicks: 2400 },
      { id: 'resistance', amplifier: 0, durationTicks: 6000 },
      { id: 'fire_resistance', amplifier: 0, durationTicks: 6000 },
    ];
  }
  return [
    { id: 'regeneration', amplifier: 1, durationTicks: 100 },
    { id: 'absorption', amplifier: 0, durationTicks: 2400 },
  ];
}

export function curesZombieVillager(_kind: AppleKind): boolean {
  return true;
}
