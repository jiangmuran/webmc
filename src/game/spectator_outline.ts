// Spectator sees nearby player outlines through walls.

export const SPECTATOR_OUTLINE_DISTANCE = 64;

export function shouldDrawOutline(
  spectatorPos: { x: number; y: number; z: number },
  otherPos: { x: number; y: number; z: number },
): boolean {
  const d = Math.hypot(
    otherPos.x - spectatorPos.x,
    otherPos.y - spectatorPos.y,
    otherPos.z - spectatorPos.z,
  );
  return d <= SPECTATOR_OUTLINE_DISTANCE;
}

export function outlineColorForTeam(teamColor: string | null): number {
  if (teamColor === null) return 0xffffff;
  const map: Record<string, number> = {
    red: 0xff5555,
    blue: 0x5555ff,
    green: 0x55ff55,
    yellow: 0xffff55,
  };
  return map[teamColor] ?? 0xffffff;
}
