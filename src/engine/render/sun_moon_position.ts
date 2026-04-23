export function celestialAngleForTick(timeOfDay: number): number {
  const day = ((timeOfDay % 24000) + 24000) % 24000;
  const phase = day / 24000;
  return phase * Math.PI * 2;
}

export function sunPosition(timeOfDay: number): { x: number; y: number; z: number } {
  const angle = celestialAngleForTick(timeOfDay);
  return { x: 0, y: Math.sin(angle), z: Math.cos(angle) };
}

export function moonPosition(timeOfDay: number): { x: number; y: number; z: number } {
  const s = sunPosition(timeOfDay);
  return { x: s.x, y: -s.y, z: -s.z };
}

export function brightnessFromSun(timeOfDay: number): number {
  return Math.max(0, sunPosition(timeOfDay).y);
}
