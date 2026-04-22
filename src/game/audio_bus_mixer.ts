// Audio bus mixer. Per-category volumes; master caps them.

export type BusName =
  | 'master'
  | 'music'
  | 'record'
  | 'weather'
  | 'block'
  | 'hostile'
  | 'neutral'
  | 'player'
  | 'ambient'
  | 'voice';

export type BusVolumes = Partial<Record<BusName, number>>;

export function effectiveVolume(busses: BusVolumes, category: BusName): number {
  const master = clamp(busses.master ?? 1);
  const cat = clamp(busses[category] ?? 1);
  if (category === 'master') return master;
  return master * cat;
}

function clamp(v: number): number {
  return Math.max(0, Math.min(1, v));
}

// Fade target over duration (ms). Returns current volume sample.
export function fadeCurrent(
  fromVol: number,
  toVol: number,
  elapsedMs: number,
  durationMs: number,
): number {
  if (durationMs <= 0) return toVol;
  const f = Math.min(1, elapsedMs / durationMs);
  return fromVol + (toVol - fromVol) * f;
}

// Ducking: when voice bus is active, drop music by N dB.
export function duckFactor(voiceActive: boolean): number {
  return voiceActive ? 0.25 : 1;
}
