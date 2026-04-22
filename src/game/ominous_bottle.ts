// Ominous bottle + Bad Omen effect (1.21 reworked). Bad Omen triggers a
// raid when the afflicted player enters a village; in 1.21 the drinking
// converts Bad Omen → Trial Omen (for ominous trial chambers).

export interface BadOmenEffect {
  amplifier: number; // 0..4 (I..V)
  remainingSec: number;
}

const BASE_DURATION_SEC = 6000; // ~100 minutes

export function applyBadOmen(current: BadOmenEffect | null, level: number): BadOmenEffect {
  const newAmp = Math.min(4, Math.max(0, level - 1));
  if (!current || newAmp > current.amplifier) {
    return { amplifier: newAmp, remainingSec: BASE_DURATION_SEC };
  }
  return { amplifier: current.amplifier, remainingSec: BASE_DURATION_SEC };
}

// Trial omen: applied by drinking an ominous bottle. Affects nearby
// trial spawners → convert to ominous.
export interface TrialOmenState {
  amplifier: number;
  remainingSec: number;
}

export function drinkOminousBottle(level: number): TrialOmenState {
  const amplifier = Math.min(4, Math.max(0, level - 1));
  return { amplifier, remainingSec: 240 + amplifier * 60 }; // 4-8 min
}

// Entering a village with Bad Omen starts a raid; caller handles the raid
// spawn itself.
export interface RaidTrigger {
  startRaid: boolean;
  level: number;
  consumeBadOmen: boolean;
}

export function tryStartRaid(inVillage: boolean, omen: BadOmenEffect | null): RaidTrigger {
  if (!inVillage || !omen) return { startRaid: false, level: 0, consumeBadOmen: false };
  return { startRaid: true, level: omen.amplifier + 1, consumeBadOmen: true };
}
