export type Weather = 'clear' | 'rain' | 'thunder';

export interface WeatherCtx {
  currentWeather: Weather;
  durationTicks: number;
}

export const CLEAR_MIN = 12000;
export const CLEAR_MAX = 180000;
export const RAIN_MIN = 12000;
export const RAIN_MAX = 24000;
export const THUNDER_MIN = 3600;
export const THUNDER_MAX = 15600;

export function nextWeather(current: Weather, rng: () => number): Weather {
  if (current === 'clear') return rng() < 0.95 ? 'rain' : 'thunder';
  if (current === 'rain') return rng() < 0.5 ? 'clear' : 'thunder';
  return 'rain';
}

export function rollDuration(w: Weather, rng: () => number): number {
  const [min, max] =
    w === 'clear'
      ? [CLEAR_MIN, CLEAR_MAX]
      : w === 'rain'
        ? [RAIN_MIN, RAIN_MAX]
        : [THUNDER_MIN, THUNDER_MAX];
  return min + Math.floor(rng() * (max - min));
}
