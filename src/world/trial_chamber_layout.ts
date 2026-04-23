// Trial chamber room tags + connectivity constraints.

export type TrialRoom =
  | 'entrance'
  | 'reward_vault'
  | 'spawner_room'
  | 'corridor'
  | 'slime_pit'
  | 'breeze_room'
  | 'pit'
  | 'ominous_vault_room';

export const TRIAL_ROOM_WEIGHTS: Record<TrialRoom, number> = {
  entrance: 5,
  reward_vault: 6,
  spawner_room: 30,
  corridor: 40,
  slime_pit: 4,
  breeze_room: 3,
  pit: 6,
  ominous_vault_room: 2,
};

export function isReward(r: TrialRoom): boolean {
  return r === 'reward_vault' || r === 'ominous_vault_room';
}

export function isSpawnerLike(r: TrialRoom): boolean {
  return r === 'spawner_room' || r === 'breeze_room' || r === 'slime_pit';
}

export const TRIAL_VOLUME_MIN_BLOCKS = 40_000;
