// Weather state machine. Three states: clear, rain, thunder. Transitions
// are driven by a timer that ticks down each second; on reaching 0, the
// engine rolls for the next state and picks a random duration in range.

export type WeatherState = 'clear' | 'rain' | 'thunder';

export interface WeatherModel {
  state: WeatherState;
  secondsUntilChange: number;
}

export function makeWeather(): WeatherModel {
  return { state: 'clear', secondsUntilChange: randomClearDuration(() => 0.5) };
}

// MC durations: clear 0.5..7.5 days, rain 0.5..1 day (thunder is a
// sub-state of rain 15%).
const DAY_SEC = 24 * 60; // 24-min MC day

function randomClearDuration(rng: () => number): number {
  return DAY_SEC * (0.5 + rng() * 7);
}

function randomRainDuration(rng: () => number): number {
  return DAY_SEC * (0.5 + rng() * 0.5);
}

export interface WeatherTickResult {
  transitioned: boolean;
  newState: WeatherState;
}

export function tickWeather(
  model: WeatherModel,
  dtSec: number,
  rng: () => number,
): WeatherTickResult {
  model.secondsUntilChange -= dtSec;
  if (model.secondsUntilChange > 0) return { transitioned: false, newState: model.state };
  if (model.state === 'clear') {
    const thunder = rng() < 0.15;
    model.state = thunder ? 'thunder' : 'rain';
    model.secondsUntilChange = randomRainDuration(rng);
  } else {
    model.state = 'clear';
    model.secondsUntilChange = randomClearDuration(rng);
  }
  return { transitioned: true, newState: model.state };
}

export function forceWeather(model: WeatherModel, state: WeatherState, durationSec: number): void {
  model.state = state;
  model.secondsUntilChange = durationSec;
}

export function canRainInBiome(biome: string): boolean {
  const dry = ['desert', 'badlands', 'savanna', 'nether_wastes', 'the_end'];
  return !dry.includes(biome);
}
