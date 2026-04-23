export type Environment = 'open' | 'cave' | 'underwater' | 'nether' | 'indoor_small' | 'indoor_large';

export const REVERB_WET: Record<Environment, number> = {
  open: 0,
  cave: 0.8,
  underwater: 0.6,
  nether: 0.5,
  indoor_small: 0.2,
  indoor_large: 0.45,
};

export function wetness(env: Environment): number {
  return REVERB_WET[env];
}

export function dryness(env: Environment): number {
  return 1 - wetness(env);
}
