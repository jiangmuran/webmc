export type BossBarColor = 'pink' | 'blue' | 'red' | 'green' | 'yellow' | 'purple' | 'white';

export type BossBarDivisions = 0 | 6 | 10 | 12 | 20;

export interface BossBar {
  id: string;
  title: string;
  color: BossBarColor;
  divisions: BossBarDivisions;
  health: number;
  maxHealth: number;
  darkenSky: boolean;
  playBossMusic: boolean;
  fog: boolean;
}

export function healthFraction(b: BossBar): number {
  return b.maxHealth <= 0 ? 0 : Math.max(0, Math.min(1, b.health / b.maxHealth));
}

export function renderSegments(b: BossBar): number {
  if (b.divisions === 0) return 1;
  return b.divisions;
}

export function activeStackIds(bars: readonly BossBar[]): readonly string[] {
  return bars.filter((b) => b.health > 0).map((b) => b.id);
}
