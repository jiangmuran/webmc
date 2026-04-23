// Raid trigger: entering village while player has Bad Omen effect.

export interface RaidTriggerCtx {
  playerHasBadOmen: boolean;
  insideVillage: boolean;
  alreadyRaiding: boolean;
  dimension: string;
}

export function shouldStartRaid(c: RaidTriggerCtx): boolean {
  if (c.dimension !== 'overworld') return false;
  if (!c.playerHasBadOmen) return false;
  if (!c.insideVillage) return false;
  return !c.alreadyRaiding;
}

export function omenAmplifierToRaidBadness(amplifier: number): number {
  return Math.max(0, amplifier);
}

export function consumeBadOmenOnStart(): boolean {
  return true;
}
