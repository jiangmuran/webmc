export function sunDirection(sunAngleRad: number): { x: number; y: number; z: number } {
  return {
    x: Math.cos(sunAngleRad),
    y: Math.sin(sunAngleRad),
    z: 0,
  };
}

export function shadowCastsFromLight(dir: { y: number }): boolean {
  return dir.y > 0;
}

export function inverseDirection(d: { x: number; y: number; z: number }): {
  x: number;
  y: number;
  z: number;
} {
  return { x: -d.x, y: -d.y, z: -d.z };
}
