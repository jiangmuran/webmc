// Totem of undying save. If a player holds a totem in either hand
// when about to die, consume it and restore them with Regen II / Abs IV.

export interface FatalCtx {
  hasTotemMainHand: boolean;
  hasTotemOffHand: boolean;
}

export interface SaveResult {
  saved: boolean;
  consumedHand: 'main' | 'off' | null;
  grantedEffects: { id: string; durationTicks: number; amplifier: number }[];
}

export function onFatalHit(c: FatalCtx): SaveResult {
  if (c.hasTotemOffHand) return { saved: true, consumedHand: 'off', grantedEffects: gifts() };
  if (c.hasTotemMainHand) return { saved: true, consumedHand: 'main', grantedEffects: gifts() };
  return { saved: false, consumedHand: null, grantedEffects: [] };
}

function gifts(): { id: string; durationTicks: number; amplifier: number }[] {
  return [
    { id: 'regeneration', durationTicks: 900, amplifier: 1 },
    { id: 'absorption', durationTicks: 100, amplifier: 1 },
    { id: 'fire_resistance', durationTicks: 800, amplifier: 0 },
  ];
}

export function hpAfterSave(): number {
  return 1; // player left at 1 HP before regen kicks in
}
