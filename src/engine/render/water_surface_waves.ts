export const WAVE_AMPLITUDE = 0.0625;
export const WAVE_SPEED = 0.02;

export function surfaceOffset(x: number, z: number, timeSeconds: number): number {
  return (
    WAVE_AMPLITUDE *
    Math.sin(x * 0.5 + timeSeconds * WAVE_SPEED * 50) *
    Math.cos(z * 0.3 + timeSeconds * WAVE_SPEED * 30)
  );
}

export function flowUV(u: number, v: number, timeSeconds: number): { u: number; v: number } {
  return {
    u: u + timeSeconds * WAVE_SPEED * 2,
    v: v + timeSeconds * WAVE_SPEED,
  };
}
