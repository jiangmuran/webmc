// Sound category mixer. Each category has its own gain; master
// multiplies all.

export type SoundCategory =
  | 'master'
  | 'music'
  | 'record'
  | 'block'
  | 'hostile'
  | 'neutral'
  | 'player'
  | 'ambient'
  | 'voice'
  | 'weather';

export interface Mixer {
  gains: Record<SoundCategory, number>;
}

export function defaultMixer(): Mixer {
  return {
    gains: {
      master: 1,
      music: 1,
      record: 1,
      block: 1,
      hostile: 1,
      neutral: 1,
      player: 1,
      ambient: 1,
      voice: 1,
      weather: 1,
    },
  };
}

export function setGain(m: Mixer, cat: SoundCategory, value: number): Mixer {
  const clamped = Math.max(0, Math.min(1, value));
  return { gains: { ...m.gains, [cat]: clamped } };
}

export function effectiveGain(m: Mixer, cat: SoundCategory): number {
  if (cat === 'master') return m.gains.master;
  return m.gains.master * m.gains[cat];
}

export function muteAll(m: Mixer): Mixer {
  return { gains: { ...m.gains, master: 0 } };
}
