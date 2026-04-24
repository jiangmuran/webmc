import { describe, it, expect } from 'vitest';
import { tick, forceClear, type WeatherState } from './weather_state_machine';

const clear: WeatherState = { current: 'clear', ticksUntilChange: 10 };

describe('weather state machine', () => {
  it('countdown ticks', () => {
    expect(tick(clear, () => 0.5).ticksUntilChange).toBe(9);
  });

  it('transitions clear → rain or thunder', () => {
    const next = tick({ current: 'clear', ticksUntilChange: 0 }, () => 0.5);
    expect(['rain', 'thunder']).toContain(next.current);
  });

  it('rain → clear eventually', () => {
    const next = tick({ current: 'rain', ticksUntilChange: 0 }, () => 0.5);
    expect(next.current).toBe('clear');
  });

  it('force clear', () => {
    expect(forceClear({ current: 'thunder', ticksUntilChange: 10 }).current).toBe('clear');
  });

  it('deterministic for seed', () => {
    const seed = () => 0.3;
    expect(tick({ current: 'clear', ticksUntilChange: 0 }, seed).current).toBe(
      tick({ current: 'clear', ticksUntilChange: 0 }, seed).current,
    );
  });
});
