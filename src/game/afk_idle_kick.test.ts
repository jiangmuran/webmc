import { describe, it, expect } from 'vitest';
import { isAfk, shouldKick, IDLE_KICK_TICKS, AFK_FLAG_TICKS } from './afk_idle_kick';

describe('afk idle kick', () => {
  it('short idle not afk', () => {
    expect(isAfk({ lastInputTick: 0, currentTick: 100, idleKickEnabled: true })).toBe(false);
  });

  it('afk at threshold', () => {
    expect(isAfk({ lastInputTick: 0, currentTick: AFK_FLAG_TICKS, idleKickEnabled: true })).toBe(
      true,
    );
  });

  it('kicks at longer threshold', () => {
    expect(
      shouldKick({ lastInputTick: 0, currentTick: IDLE_KICK_TICKS, idleKickEnabled: true }),
    ).toBe(true);
  });

  it('no kick when disabled', () => {
    expect(shouldKick({ lastInputTick: 0, currentTick: 99999, idleKickEnabled: false })).toBe(
      false,
    );
  });
});
