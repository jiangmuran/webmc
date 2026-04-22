// Sound events registry. Maps a symbolic event ("block.break",
// "mob.zombie.hurt") to a sound clip name + volume + pitch range.
// Keeps gameplay code decoupled from actual audio asset paths.

export interface SoundDef {
  clip: string;
  volume: number;
  pitchMin: number;
  pitchMax: number;
}

export const SOUND_EVENTS: Record<string, SoundDef> = {
  'block.break': { clip: 'break', volume: 0.8, pitchMin: 0.9, pitchMax: 1.1 },
  'block.place': { clip: 'place', volume: 0.7, pitchMin: 0.9, pitchMax: 1.1 },
  'block.step.stone': { clip: 'step_stone', volume: 0.4, pitchMin: 0.95, pitchMax: 1.05 },
  'block.step.grass': { clip: 'step_grass', volume: 0.4, pitchMin: 0.95, pitchMax: 1.05 },
  'block.step.wood': { clip: 'step_wood', volume: 0.4, pitchMin: 0.95, pitchMax: 1.05 },
  'block.step.sand': { clip: 'step_sand', volume: 0.3, pitchMin: 0.95, pitchMax: 1.05 },
  'block.step.snow': { clip: 'step_snow', volume: 0.3, pitchMin: 0.95, pitchMax: 1.05 },
  'player.hurt': { clip: 'hurt', volume: 0.9, pitchMin: 0.9, pitchMax: 1.1 },
  'player.death': { clip: 'death', volume: 1, pitchMin: 1, pitchMax: 1 },
  'player.levelup': { clip: 'levelup', volume: 1, pitchMin: 1, pitchMax: 1 },
  'player.eat': { clip: 'eat', volume: 0.5, pitchMin: 0.95, pitchMax: 1.05 },
  'player.drink': { clip: 'drink', volume: 0.5, pitchMin: 0.95, pitchMax: 1.05 },
  'entity.arrow.hit': { clip: 'arrow_hit', volume: 0.8, pitchMin: 0.9, pitchMax: 1.1 },
  'entity.arrow.shoot': { clip: 'arrow_shoot', volume: 0.7, pitchMin: 0.9, pitchMax: 1.1 },
  'entity.tnt.prime': { clip: 'tnt_prime', volume: 1, pitchMin: 1, pitchMax: 1 },
  'entity.tnt.explode': { clip: 'explosion', volume: 1, pitchMin: 0.9, pitchMax: 1.1 },
  'entity.zombie.hurt': { clip: 'zombie_hurt', volume: 1, pitchMin: 0.95, pitchMax: 1.05 },
  'entity.zombie.ambient': { clip: 'zombie_amb', volume: 1, pitchMin: 0.95, pitchMax: 1.05 },
  'entity.creeper.prime': { clip: 'creeper_prime', volume: 1, pitchMin: 1, pitchMax: 1 },
  'entity.skeleton.hurt': { clip: 'skeleton_hurt', volume: 1, pitchMin: 0.95, pitchMax: 1.05 },
  'entity.ender_dragon.growl': { clip: 'dragon_growl', volume: 1, pitchMin: 1, pitchMax: 1 },
  'weather.rain': { clip: 'rain_loop', volume: 0.7, pitchMin: 1, pitchMax: 1 },
  'weather.thunder': { clip: 'thunder', volume: 1, pitchMin: 1, pitchMax: 1 },
  'ambient.cave': { clip: 'cave_amb', volume: 0.6, pitchMin: 0.9, pitchMax: 1.1 },
  'ui.button_click': { clip: 'ui_click', volume: 0.6, pitchMin: 1, pitchMax: 1 },
  'portal.travel': { clip: 'portal', volume: 1, pitchMin: 1, pitchMax: 1 },
  'ambient.sleep': { clip: 'sleep', volume: 0.5, pitchMin: 1, pitchMax: 1 },
};

export function soundFor(event: string): SoundDef | null {
  return SOUND_EVENTS[event] ?? null;
}

// Pick a pitch uniformly from the event's range.
export function pickPitch(event: string, rng: () => number = Math.random): number {
  const def = soundFor(event);
  if (!def) return 1;
  return def.pitchMin + rng() * (def.pitchMax - def.pitchMin);
}
