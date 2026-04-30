// Totem of Undying. When held in main/off-hand, lethal damage instead
// sets HP to 1 and applies Regen II, Absorption II, Fire Resistance I.
//
// Wiki (minecraft.wiki/w/Totem_of_Undying):
//   Regeneration II for 0:45 (45 s = 900 ticks) — sibling
//     totem_undying_revive.ts had 800 (40 s) by an earlier wrong
//     "fix"; wiki's Infobox shows Regeneration II (0:45).
//   Fire Resistance I for 0:40 (800 ticks).
//   Absorption II for 0:05 (100 ticks).

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
  // Wiki (minecraft.wiki/w/Totem_of_Undying): when both hands hold a
  // totem, the OFF-HAND is consumed first. Old code returned
  // consumedFromMain=true whenever mainhand had a totem (even when
  // the offhand also had one) — opposite of wiki and inconsistent
  // with sibling totem_offhand_priority module.
  const consumedFromMain = !hasOff && hasMain;
  return {
    saved: true,
    consumedFromMain,
    newHp: 1,
    effects: [
      { id: 'regeneration', amp: 1, durationTicks: 900 },
      { id: 'absorption', amp: 1, durationTicks: 100 },
      { id: 'fire_resistance', amp: 0, durationTicks: 800 },
    ],
  };
}
