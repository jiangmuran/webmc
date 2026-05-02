import { describe, it, expect } from 'vitest';
import { divertsStrike, strikeRod, redstoneOutput, SIGNAL_TICKS } from './lightning_rod_redir';

describe('lightning rod', () => {
  it('diverts within range', () => {
    expect(
      divertsStrike({
        rodPos: { x: 0, y: 100, z: 0 },
        strikePos: { x: 10, y: 100, z: 10 },
        dim: 'overworld',
      }),
    ).toBe(true);
  });

  it('no divert in nether', () => {
    expect(
      divertsStrike({
        rodPos: { x: 0, y: 100, z: 0 },
        strikePos: { x: 0, y: 100, z: 0 },
        dim: 'nether',
      }),
    ).toBe(false);
  });

  it('diverts at 100-block range (wiki: 128 sphere, Java)', () => {
    expect(
      divertsStrike({
        rodPos: { x: 0, y: 100, z: 0 },
        strikePos: { x: 100, y: 100, z: 0 },
        dim: 'overworld',
      }),
    ).toBe(true);
  });

  it('no divert beyond 128-block sphere (wiki Java)', () => {
    expect(
      divertsStrike({
        rodPos: { x: 0, y: 100, z: 0 },
        strikePos: { x: 200, y: 100, z: 0 },
        dim: 'overworld',
      }),
    ).toBe(false);
  });

  it('signal pulse', () => {
    const s = { poweredUntilTick: 0 };
    strikeRod(s, 100);
    expect(redstoneOutput(s, 100)).toBe(15);
    expect(redstoneOutput(s, 100 + SIGNAL_TICKS - 1)).toBe(15);
    expect(redstoneOutput(s, 100 + SIGNAL_TICKS)).toBe(0);
  });
});
