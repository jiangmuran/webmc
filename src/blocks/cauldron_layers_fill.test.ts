import { describe, it, expect } from 'vitest';
import {
  rainFills,
  useBucket,
  dispenseBottle,
  MAX_LEVEL,
  type Cauldron,
} from './cauldron_layers_fill';

const empty: Cauldron = { content: 'empty', level: 0 };

describe('cauldron layers fill', () => {
  it('rain adds water level', () => {
    expect(rainFills(empty, true).level).toBe(1);
  });

  it('rain without rain no change', () => {
    expect(rainFills(empty, false)).toBe(empty);
  });

  it('rain does not mix with lava', () => {
    const lava: Cauldron = { content: 'lava', level: 3 };
    expect(rainFills(lava, true)).toBe(lava);
  });

  it('bucket fills to max', () => {
    expect(useBucket(empty, 'water')?.level).toBe(MAX_LEVEL);
  });

  it('bucket cannot mix content', () => {
    expect(useBucket({ content: 'water', level: 2 }, 'lava')).toBeUndefined();
  });

  it('bottle empties one layer', () => {
    const r = dispenseBottle({ content: 'water', level: 2 });
    expect(r?.cauldron.level).toBe(1);
    expect(r?.item).toBe('water_bottle');
  });

  it('empty cauldron no bottle', () => {
    expect(dispenseBottle(empty)).toBeUndefined();
  });
});
