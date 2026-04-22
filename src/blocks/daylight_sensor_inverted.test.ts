import { describe, it, expect } from 'vitest';
import {
  makeDaylightSensor,
  sensorOutput,
  skyLightAtTime,
  toggleInverted,
} from './daylight_sensor_inverted';

describe('daylight sensor', () => {
  it('normal noon = 15', () => {
    const s = makeDaylightSensor();
    expect(sensorOutput(s, { skyLight: 15, weather: 'clear' })).toBe(15);
  });

  it('inverted noon = 0', () => {
    const s = makeDaylightSensor(true);
    expect(sensorOutput(s, { skyLight: 15, weather: 'clear' })).toBe(0);
  });

  it('night = 0 normal, 15 inverted', () => {
    const s = makeDaylightSensor();
    expect(sensorOutput(s, { skyLight: 0, weather: 'clear' })).toBe(0);
    const si = makeDaylightSensor(true);
    expect(sensorOutput(si, { skyLight: 0, weather: 'clear' })).toBe(15);
  });

  it('rain dims daytime', () => {
    const s = makeDaylightSensor();
    expect(sensorOutput(s, { skyLight: 15, weather: 'rain' })).toBe(12);
  });

  it('toggleInverted flips', () => {
    const s = makeDaylightSensor();
    toggleInverted(s);
    expect(s.inverted).toBe(true);
  });

  it('skyLightAtTime: midnight = 0, noon = 15', () => {
    expect(skyLightAtTime(0.75)).toBe(0);
    expect(skyLightAtTime(0.25)).toBe(15);
  });
});
