export const EXHAUSTION: Record<string, number> = {
  walk: 0.0,
  sprint: 0.1,
  jump: 0.05,
  sprint_jump: 0.2,
  swim: 0.01,
  mine_block: 0.005,
  attack: 0.1,
  damage: 0.1,
  regen: 6,
};

export function addExhaustion(current: number, action: string): number {
  const delta = EXHAUSTION[action] ?? 0;
  return current + delta;
}

export function saturationConsumesAt(): number {
  return 4;
}
