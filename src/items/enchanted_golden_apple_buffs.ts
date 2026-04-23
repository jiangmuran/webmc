export interface AppliedEffect {
  id: string;
  level: number;
  durationTicks: number;
}

export function enchantedGoldenAppleEffects(): readonly AppliedEffect[] {
  return [
    { id: 'absorption', level: 4, durationTicks: 2400 },
    { id: 'regeneration', level: 2, durationTicks: 400 },
    { id: 'resistance', level: 1, durationTicks: 20 * 60 * 5 },
    { id: 'fire_resistance', level: 1, durationTicks: 20 * 60 * 5 },
  ];
}

export function regularGoldenAppleEffects(): readonly AppliedEffect[] {
  return [
    { id: 'absorption', level: 1, durationTicks: 2400 },
    { id: 'regeneration', level: 2, durationTicks: 100 },
  ];
}
