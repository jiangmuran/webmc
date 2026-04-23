import { describe, it, expect } from 'vitest';
import { tickUnderwater } from './ambient_underwater';

describe('ambient underwater', () => {
  it('silent on land', () => {
    const r = tickUnderwater(
      { submerged: false, ticksUntilNextLoop: 0, ticksUntilNextRare: 0 },
      () => 0.5,
    );
    expect(r.play).toBeUndefined();
  });

  it('loop fires when timer lapses', () => {
    const r = tickUnderwater(
      { submerged: true, ticksUntilNextLoop: 1, ticksUntilNextRare: 500 },
      () => 0.5,
    );
    expect(r.play).toBe('ambient.underwater.loop');
  });

  it('rare fires when only rare lapses', () => {
    const r = tickUnderwater(
      { submerged: true, ticksUntilNextLoop: 500, ticksUntilNextRare: 1 },
      () => 0.5,
    );
    expect(r.play).toBe('ambient.underwater.rare');
  });

  it('decrement only when silent', () => {
    const r = tickUnderwater(
      { submerged: true, ticksUntilNextLoop: 200, ticksUntilNextRare: 400 },
      () => 0.5,
    );
    expect(r.state.ticksUntilNextLoop).toBe(199);
    expect(r.play).toBeUndefined();
  });
});
