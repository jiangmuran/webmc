export interface CaptainKillInput {
  killerHadBadOmen: boolean;
  killerIsPlayer: boolean;
  currentBadOmenLevel: number;
}

export const BAD_OMEN_MAX_LEVEL = 5;
export const BAD_OMEN_DURATION = 20 * 60 * 100;

export function badOmenAfterKill(i: CaptainKillInput):
  | {
      level: number;
      durationTicks: number;
    }
  | undefined {
  if (!i.killerIsPlayer) return undefined;
  const level = Math.min(BAD_OMEN_MAX_LEVEL, i.currentBadOmenLevel + 1);
  return { level, durationTicks: BAD_OMEN_DURATION };
}

export function isOminousBanner(name: string): boolean {
  return name === 'ominous_banner' || name === 'illager_banner';
}
