export interface RumbleRequest {
  lowIntensity: number;
  highIntensity: number;
  durationMs: number;
}

export function clampRumble(r: RumbleRequest): RumbleRequest {
  return {
    lowIntensity: Math.max(0, Math.min(1, r.lowIntensity)),
    highIntensity: Math.max(0, Math.min(1, r.highIntensity)),
    durationMs: Math.max(0, Math.min(5000, r.durationMs)),
  };
}

export function mergeRumble(a: RumbleRequest, b: RumbleRequest): RumbleRequest {
  return clampRumble({
    lowIntensity: Math.max(a.lowIntensity, b.lowIntensity),
    highIntensity: Math.max(a.highIntensity, b.highIntensity),
    durationMs: Math.max(a.durationMs, b.durationMs),
  });
}

export function rumbleForDamage(damage: number): RumbleRequest {
  return clampRumble({
    lowIntensity: damage / 20,
    highIntensity: damage / 10,
    durationMs: Math.max(50, damage * 10),
  });
}
