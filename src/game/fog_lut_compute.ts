// Fog LUT. Produces fog color + distance per time-of-day and weather.
// Sample-based lookup for smooth transitions.

export interface FogSample {
  color: { r: number; g: number; b: number };
  nearDistance: number;
  farDistance: number;
}

export interface FogQuery {
  timeOfDay: number; // 0..24000
  weather: 'clear' | 'rain' | 'thunder';
  biomeTemperature: number;
  inNether: boolean;
  inEnd: boolean;
  underwater: boolean;
}

export function fogFor(q: FogQuery): FogSample {
  if (q.inEnd) {
    return { color: { r: 10, g: 0, b: 16 }, nearDistance: 4, farDistance: 128 };
  }
  if (q.inNether) {
    return { color: { r: 53, g: 7, b: 7 }, nearDistance: 1, farDistance: 30 };
  }
  if (q.underwater) {
    return { color: { r: 25, g: 50, b: 100 }, nearDistance: 4, farDistance: 30 };
  }
  // Day-night cycle color blend
  const isNight = q.timeOfDay >= 13000 && q.timeOfDay <= 23000;
  let base = isNight ? { r: 20, g: 30, b: 50 } : { r: 140, g: 200, b: 255 };
  if (q.weather === 'rain') {
    base = {
      r: Math.floor(base.r * 0.7),
      g: Math.floor(base.g * 0.7),
      b: Math.floor(base.b * 0.7),
    };
  } else if (q.weather === 'thunder') {
    base = { r: 50, g: 50, b: 60 };
  }
  return { color: base, nearDistance: 16, farDistance: q.weather === 'clear' ? 200 : 80 };
}
