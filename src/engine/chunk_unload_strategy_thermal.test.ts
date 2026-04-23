import { describe, it, expect } from 'vitest';
import { inThermalThrottle, suggestedChunkRadius } from './chunk_unload_strategy_thermal';

describe('chunk unload strategy thermal', () => {
  it('hot cpu throttles', () => {
    expect(inThermalThrottle({ cpuTempCelsius: 80, fpsP95: 60, battery: 1 })).toBe(true);
  });

  it('low fps throttles', () => {
    expect(inThermalThrottle({ cpuTempCelsius: 50, fpsP95: 15, battery: 1 })).toBe(true);
  });

  it('cool full battery idle', () => {
    expect(inThermalThrottle({ cpuTempCelsius: 50, fpsP95: 60, battery: 1 })).toBe(false);
  });

  it('throttle lowers radius', () => {
    expect(suggestedChunkRadius({ cpuTempCelsius: 80, fpsP95: 60, battery: 1 }, 12)).toBeLessThan(
      12,
    );
  });

  it('radius floors at 4', () => {
    expect(suggestedChunkRadius({ cpuTempCelsius: 80, fpsP95: 60, battery: 1 }, 4)).toBe(4);
  });
});
