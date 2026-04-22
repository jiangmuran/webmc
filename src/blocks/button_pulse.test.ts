import { describe, it, expect } from 'vitest';
import { pulseTicks, onPress, tick, pressableByArrow } from './button_pulse';

describe('button pulse', () => {
  it('wood 30 ticks', () => {
    expect(pulseTicks('wood')).toBe(30);
  });

  it('stone 20 ticks', () => {
    expect(pulseTicks('stone')).toBe(20);
  });

  it('press starts powered', () => {
    expect(onPress('stone').powered).toBe(true);
  });

  it('tick decays', () => {
    let s = onPress('stone');
    for (let i = 0; i < 20; i++) s = tick(s);
    expect(s.powered).toBe(false);
  });

  it('wood arrow pressable', () => {
    expect(pressableByArrow('wood')).toBe(true);
    expect(pressableByArrow('stone')).toBe(false);
  });
});
