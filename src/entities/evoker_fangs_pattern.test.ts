import { describe, it, expect } from 'vitest';
import {
  castFangsLine,
  fangHitsThisTick,
  FANG_LINE_LENGTH,
  FANG_BITE_DELAY_TICKS,
} from './evoker_fangs_pattern';

describe('evoker fangs line', () => {
  it('spawns N fangs', () => {
    const f = castFangsLine({ originX: 0, originY: 64, originZ: 0, directionX: 1, directionZ: 0 });
    expect(f.length).toBe(FANG_LINE_LENGTH);
  });

  it('each offset + 1', () => {
    const f = castFangsLine({ originX: 0, originY: 0, originZ: 0, directionX: 1, directionZ: 0 });
    for (let i = 0; i < f.length; i++) {
      expect(f[i]?.spawnTickOffset).toBe(i + 1);
    }
  });

  it('line is in direction', () => {
    const f = castFangsLine({ originX: 0, originY: 0, originZ: 0, directionX: 1, directionZ: 0 });
    expect(f[0]?.x).toBeGreaterThan(0);
    expect(f[0]?.z).toBe(0);
  });

  it('hit timing', () => {
    const f = castFangsLine({ originX: 0, originY: 0, originZ: 0, directionX: 0, directionZ: 1 });
    const fang0 = f[0];
    if (fang0) {
      expect(fangHitsThisTick(fang0, 10, 10 + fang0.spawnTickOffset + FANG_BITE_DELAY_TICKS)).toBe(
        true,
      );
      expect(fangHitsThisTick(fang0, 10, 11)).toBe(false);
    }
  });
});
