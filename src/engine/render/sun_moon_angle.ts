export function sunAngle(timeOfDay: number): number {
  const t = ((timeOfDay % 24000) + 24000) % 24000;
  return (t / 24000) * Math.PI * 2;
}

export function moonAngle(timeOfDay: number): number {
  return sunAngle(timeOfDay) + Math.PI;
}

export function sunAboveHorizon(timeOfDay: number): boolean {
  const a = sunAngle(timeOfDay);
  return Math.sin(a) > 0;
}
