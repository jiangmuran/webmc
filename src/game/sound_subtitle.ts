export interface SoundEvent {
  source: string;
  subtitle?: string;
  dx: number;
  dz: number;
}

export function directionLabel(e: SoundEvent): string {
  const ang = Math.atan2(e.dz, e.dx);
  const deg = (ang * 180) / Math.PI;
  if (deg >= -22.5 && deg < 22.5) return 'E';
  if (deg >= 22.5 && deg < 67.5) return 'SE';
  if (deg >= 67.5 && deg < 112.5) return 'S';
  if (deg >= 112.5 && deg < 157.5) return 'SW';
  if (deg >= 157.5 || deg < -157.5) return 'W';
  if (deg >= -157.5 && deg < -112.5) return 'NW';
  if (deg >= -112.5 && deg < -67.5) return 'N';
  return 'NE';
}

export function subtitleLine(e: SoundEvent): string | undefined {
  if (!e.subtitle) return undefined;
  return `${e.subtitle} [${directionLabel(e)}]`;
}
