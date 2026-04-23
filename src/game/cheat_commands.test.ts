import { describe, it, expect } from 'vitest';
import { parse, canExecute } from './cheat_commands';

describe('cheat commands', () => {
  it('gamemode creative', () => {
    expect(parse('/gamemode creative')).toEqual({ kind: 'gamemode', mode: 'creative' });
  });

  it('invalid gamemode', () => {
    expect(parse('/gamemode bogus').kind).toBe('invalid');
  });

  it('time day', () => {
    expect(parse('/time day')).toEqual({ kind: 'time', value: 'day' });
  });

  it('time numeric', () => {
    expect(parse('/time 1000')).toEqual({ kind: 'time', value: 1000 });
  });

  it('weather rain', () => {
    expect(parse('/weather rain')).toEqual({ kind: 'weather', kind2: 'rain' });
  });

  it('give defaults to 1', () => {
    expect(parse('/give diamond')).toEqual({ kind: 'give', item: 'diamond', count: 1 });
  });

  it('give with count', () => {
    expect(parse('/give diamond 64')).toEqual({ kind: 'give', item: 'diamond', count: 64 });
  });

  it('canExecute gated', () => {
    expect(canExecute(false)).toBe(false);
    expect(canExecute(true)).toBe(true);
  });
});
