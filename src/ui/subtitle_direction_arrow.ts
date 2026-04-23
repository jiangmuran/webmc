export interface SubtitleSpec {
  id: string;
  name: string;
  sourceX: number;
  sourceZ: number;
  expiresAtMs: number;
}

export function directionToSource(
  s: SubtitleSpec,
  playerX: number,
  playerZ: number,
  playerYaw: number,
): number {
  const dx = s.sourceX - playerX;
  const dz = s.sourceZ - playerZ;
  const world = Math.atan2(dz, dx);
  return world - playerYaw;
}

export function isVisible(s: SubtitleSpec, nowMs: number): boolean {
  return s.expiresAtMs > nowMs;
}

export function dedupeById(queue: readonly SubtitleSpec[]): readonly SubtitleSpec[] {
  const m = new Map<string, SubtitleSpec>();
  for (const s of queue) m.set(s.id, s);
  return [...m.values()];
}
