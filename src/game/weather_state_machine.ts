export type Weather = 'clear' | 'rain' | 'thunder';

export interface WeatherState {
  current: Weather;
  ticksUntilChange: number;
}

export const MIN_CLEAR_TICKS = 20 * 60 * 5;
export const MAX_CLEAR_TICKS = 20 * 60 * 15;
export const MIN_RAIN_TICKS = 20 * 60 * 5;
export const MAX_RAIN_TICKS = 20 * 60 * 10;

export function tick(s: WeatherState, rng: () => number): WeatherState {
  if (s.ticksUntilChange > 0) {
    return { ...s, ticksUntilChange: s.ticksUntilChange - 1 };
  }
  if (s.current === 'clear') {
    const thunder = rng() < 0.2;
    return {
      current: thunder ? 'thunder' : 'rain',
      ticksUntilChange: MIN_RAIN_TICKS + Math.floor(rng() * (MAX_RAIN_TICKS - MIN_RAIN_TICKS)),
    };
  }
  return {
    current: 'clear',
    ticksUntilChange: MIN_CLEAR_TICKS + Math.floor(rng() * (MAX_CLEAR_TICKS - MIN_CLEAR_TICKS)),
  };
}

export function forceClear(_s: WeatherState): WeatherState {
  return { current: 'clear', ticksUntilChange: MIN_CLEAR_TICKS };
}
