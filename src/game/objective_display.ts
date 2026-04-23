// Scoreboard objective display slot. Supports sidebar, list (tab),
// below_name.

export type DisplaySlot = 'sidebar' | 'list' | 'below_name' | 'teams_sidebar';

export interface Objective {
  name: string;
  displayName: string;
  criterion: string;
}

export interface DisplayConfig {
  slot: DisplaySlot;
  objectiveName: string | null;
}

export function setSlot(cfg: DisplayConfig, obj: Objective | null): DisplayConfig {
  return { ...cfg, objectiveName: obj?.name ?? null };
}

export function isShowing(cfg: DisplayConfig): boolean {
  return cfg.objectiveName !== null;
}

export function formatScore(player: string, score: number): string {
  return `${player}: ${score}`;
}

export const TAB_MAX_SCORES_VISIBLE = 15;
export const SIDEBAR_MAX_LINES = 15;
