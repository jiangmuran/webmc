export type FogProfile = 'clear' | 'nether_thick' | 'end_purple' | 'underwater_blue' | 'rain';

export const FOG_DENSITY: Record<FogProfile, number> = {
  clear: 0.005,
  nether_thick: 0.05,
  end_purple: 0.02,
  underwater_blue: 0.08,
  rain: 0.015,
};

export function densityFor(profile: FogProfile): number {
  return FOG_DENSITY[profile];
}

export function visibilityRange(profile: FogProfile): number {
  const d = densityFor(profile);
  return d === 0 ? 1000 : Math.min(1000, 4 / d);
}
