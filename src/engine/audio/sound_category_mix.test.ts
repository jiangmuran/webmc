import { describe, it, expect } from 'vitest';
import { defaultMixer, setGain, effectiveGain, muteAll } from './sound_category_mix';

describe('sound category mix', () => {
  it('defaults all 1', () => {
    const m = defaultMixer();
    expect(effectiveGain(m, 'music')).toBe(1);
  });

  it('setGain clamps', () => {
    expect(setGain(defaultMixer(), 'music', 5).gains.music).toBe(1);
    expect(setGain(defaultMixer(), 'music', -5).gains.music).toBe(0);
  });

  it('master multiplies', () => {
    let m = setGain(defaultMixer(), 'master', 0.5);
    m = setGain(m, 'music', 0.8);
    expect(effectiveGain(m, 'music')).toBeCloseTo(0.4);
  });

  it('muteAll zeros output', () => {
    expect(effectiveGain(muteAll(defaultMixer()), 'music')).toBe(0);
  });

  it('master returns its own', () => {
    const m = setGain(defaultMixer(), 'master', 0.7);
    expect(effectiveGain(m, 'master')).toBeCloseTo(0.7);
  });
});
