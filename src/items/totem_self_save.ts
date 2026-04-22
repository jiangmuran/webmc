// Totem of Undying. When held in main/off-hand, lethal damage instead
// sets HP to 1 and applies Regen II, Absorption II, Fire Resistance I
// for 40/100/40 ticks respectively. Consumes the totem.

export interface TotemQuery {
  mainhand: string | null;
  offhand: string | null;
  incomingDamage: number;
  currentHp: number;
}

export interface TotemResult {
  saved: boolean;
  consumedFromMain: boolean;
  newHp: number;
  effects: { id: string; amp: number; durationTicks: number }[];
}

export function tryTotem(q: TotemQuery): TotemResult {
  const lethal = q.incomingDamage >= q.currentHp;
  if (!lethal) {
    return {
      saved: false,
      consumedFromMain: false,
      newHp: q.currentHp - q.incomingDamage,
      effects: [],
    };
  }
  const hasMain = q.mainhand === 'webmc:totem_of_undying';
  const hasOff = q.offhand === 'webmc:totem_of_undying';
  if (!hasMain && !hasOff) {
    return { saved: false, consumedFromMain: false, newHp: 0, effects: [] };
  }
  return {
    saved: true,
    consumedFromMain: hasMain,
    newHp: 1,
    effects: [
      { id: 'regeneration', amp: 1, durationTicks: 800 },
      { id: 'absorption', amp: 1, durationTicks: 100 },
      { id: 'fire_resistance', amp: 0, durationTicks: 800 },
    ],
  };
}
